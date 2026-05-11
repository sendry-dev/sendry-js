# sendry

Official TypeScript SDK for the [Sendry](https://sendry.online) email API.

## Installation

```bash
npm install sendry-sdk
# or
bun add sendry
# or
pnpm add sendry
```

## Quick Start

```ts
import { Sendry } from "sendry-sdk";

const sendry = new Sendry("sn_live_your_api_key");

// Send a transactional email
const { id } = await sendry.emails.send({
  from: "you@yourdomain.com",
  to: "user@example.com",
  subject: "Hello from Sendry",
  html: "<p>Welcome aboard!</p>",
});

console.log("Email queued:", id);
```

## Configuration

```ts
const sendry = new Sendry({
  apiKey: "sn_live_...",
  baseUrl: "https://api.sendry.online",  // Override base URL (default)
  timeout: 30_000,                    // Request timeout in ms (default 30s)
  retries: 2,                         // Retry count for 5xx errors (default 2)
  headers: { "X-Custom": "value" },   // Extra headers on every request
  fetch: customFetch,                 // Custom fetch implementation
});
```

Use `sn_test_...` API keys to capture emails in the test inbox instead of sending them.

## Resources

### Emails

```ts
// Send a single email
await sendry.emails.send({ from, to, subject, html });

// Send up to 100 emails in one request
await sendry.emails.sendBatch({ from, emails: [{ to, subject, html }, ...] });

// Send a marketing email with unsubscribe support
await sendry.emails.sendMarketing({ from, to, subject, html, unsubscribe_url });

// Get email status
const email = await sendry.emails.get("em_abc123");
// email.status: "queued" | "sending" | "sent" | "delivered" | "bounced" | ...

// List emails (cursor-paginated)
const { data, has_more, next_cursor } = await sendry.emails.list({ limit: 25 });

// Cancel a queued email (only works before it is sent)
await sendry.emails.cancel("em_abc123");
```

### Domains

```ts
// Add and manage sending domains
await sendry.domains.create({ name: "mail.example.com" });
await sendry.domains.list();
await sendry.domains.get("dom_abc123");
await sendry.domains.verify("dom_abc123");      // trigger DNS check
await sendry.domains.remove("dom_abc123");

// BIMI (Brand Indicators for Message Identification)
await sendry.domains.configureBimi("dom_abc123", {
  logo_url: "https://example.com/logo.svg",
  vmc_url: "https://example.com/cert.pem",    // optional VMC
});
await sendry.domains.getBimi("dom_abc123");
await sendry.domains.verifyBimi("dom_abc123");
await sendry.domains.removeBimi("dom_abc123");
```

### Templates

```ts
// CRUD
await sendry.templates.create({ name: "Welcome", subject: "Hi {{name}}", html: "..." });
await sendry.templates.list();
await sendry.templates.get("tmpl_abc123");
await sendry.templates.update("tmpl_abc123", { subject: "Updated" });
await sendry.templates.remove("tmpl_abc123");

// Render a saved template
const { html, text } = await sendry.templates.render("tmpl_abc123", {
  variables: { name: "Alice" },
});

// Render arbitrary HTML without saving
const preview = await sendry.templates.renderAdhoc({
  html: "<h1>Hello {{name}}</h1>",
  variables: { name: "Bob" },
});

// Compile visual block design to HTML
const { html } = await sendry.templates.compileBlocks({ design: blockJson });

// Browse starter templates
const { data: starters } = await sendry.templates.listStarters();
const { data: visualStarters } = await sendry.templates.listVisualStarters();
const starter = await sendry.templates.getVisualStarter("welcome-blocks");
```

### API Keys

```ts
const { key } = await sendry.apiKeys.create({ name: "Prod Key", scope: "sending_access" });
// scope: "full_access" | "sending_access" | "read_only"
await sendry.apiKeys.list();
await sendry.apiKeys.remove("ak_abc123");
```

### Webhooks

```ts
await sendry.webhooks.create({ url: "https://...", events: ["email.delivered", "email.bounced"] });
await sendry.webhooks.list();
await sendry.webhooks.get("wh_abc123");
await sendry.webhooks.update("wh_abc123", { active: false });
await sendry.webhooks.remove("wh_abc123");
```

### Analytics

```ts
// Aggregated stats + timeseries
const stats = await sendry.analytics.stats({
  from: "2025-01-01",
  to: "2025-01-31",
  granularity: "day",  // "hour" | "day" | "week" | "month"
});

// Email event logs
const logs = await sendry.analytics.logs({ email_id: "em_abc123", type: "delivered" });

// Cohort analysis (engagement over time since send)
const cohorts = await sendry.analytics.getCohorts({ from, to, metric: "open_rate" });

// Industry benchmark comparison
const benchmarks = await sendry.analytics.getBenchmarks({ from, to });

// Opt in/out of benchmark data sharing
await sendry.analytics.toggleBenchmarkOptIn(true);

// Breakdown by domain or template
const breakdown = await sendry.analytics.getBreakdowns({ from, to, group_by: "domain" });

// Current vs previous period comparison
const comparison = await sendry.analytics.getComparison({ from, to });

// Export as CSV or JSON
const csv = await sendry.analytics.exportData({ from, to, format: "csv" });
```

### Suppression

```ts
await sendry.suppression.list();
await sendry.suppression.add({ email: "bad@example.com", reason: "hard_bounce" });
await sendry.suppression.remove("bad@example.com");
```

### Unsubscribes

```ts
await sendry.unsubscribes.list();
await sendry.unsubscribes.create({ email: "user@example.com" });
await sendry.unsubscribes.createBatch({ emails: ["a@b.com", "c@d.com"] });
await sendry.unsubscribes.get("unsub_abc123");
await sendry.unsubscribes.remove("unsub_abc123");
```

### Contacts

```ts
// CRUD
await sendry.contacts.create({ email: "jane@example.com", first_name: "Jane" });
await sendry.contacts.list({ audience_id: "aud_abc123", limit: 50 });
await sendry.contacts.get("ct_abc123");
await sendry.contacts.update("ct_abc123", { unsubscribed: true });
await sendry.contacts.remove("ct_abc123");

// Bulk import (up to 1,000 contacts; upserts by email)
const result = await sendry.contacts.bulkImport({
  contacts: [{ email: "alice@example.com" }, { email: "bob@example.com" }],
  audience_id: "aud_abc123",  // optional
});
console.log(result.created, result.updated);
```

### Audiences

```ts
// CRUD
await sendry.audiences.create({ name: "Newsletter", description: "Weekly subscribers" });
await sendry.audiences.list();
await sendry.audiences.get("aud_abc123");
await sendry.audiences.update("aud_abc123", { name: "VIP List" });
await sendry.audiences.remove("aud_abc123");

// Contact membership
await sendry.audiences.addContacts("aud_abc123", { contact_ids: ["ct_1", "ct_2"] });
await sendry.audiences.listContacts("aud_abc123");
await sendry.audiences.removeContact("aud_abc123", "ct_abc123");
```

### Campaigns

```ts
// Create and manage bulk email campaigns
const campaign = await sendry.campaigns.create({
  name: "March Newsletter",
  subject: "What's new this month",
  from: "Acme <hello@acme.com>",
  audience_id: "aud_abc123",
  html: "<h1>Hello!</h1>",
});

await sendry.campaigns.list({ status: "draft" });
await sendry.campaigns.get("cp_abc123");
await sendry.campaigns.update("cp_abc123", { subject: "Updated subject" });
await sendry.campaigns.remove("cp_abc123");

// Lifecycle actions
await sendry.campaigns.schedule("cp_abc123", { scheduled_at: "2026-04-01T10:00:00Z" });
await sendry.campaigns.send("cp_abc123");    // send immediately
await sendry.campaigns.pause("cp_abc123");   // pause while sending
await sendry.campaigns.resume("cp_abc123");  // resume a paused campaign
await sendry.campaigns.cancel("cp_abc123");  // cancel scheduled/paused
```

### Deliverability

```ts
// Reputation overview and history
const rep = await sendry.deliverability.getReputation({ days: 30 });
const history = await sendry.deliverability.getReputationHistory("dom_abc123");

// Blocklist status
const blocklist = await sendry.deliverability.getBlocklist();
await sendry.deliverability.runBlocklistCheck({ target: "example.com", target_type: "domain" });
await sendry.deliverability.dismissAlert("alert_abc123");

// Comprehensive deliverability report
const report = await sendry.deliverability.getReport({ days: 30 });
```

### Dedicated IPs

```ts
const ip = await sendry.dedicatedIps.provision({ provider: "ses" });
await sendry.dedicatedIps.list();
await sendry.dedicatedIps.get("dip_abc123");
const assignment = await sendry.dedicatedIps.assign("dip_abc123", { domain_id: "dom_xyz" });
await sendry.dedicatedIps.removeAssignment("dip_abc123", "asgn_xyz");
await sendry.dedicatedIps.release("dip_abc123");
```

### Regions

```ts
// List available SES regions
const { data: regions } = await sendry.regions.list();

// Org-level region settings
const settings = await sendry.regions.getOrgSettings();
await sendry.regions.updateOrgSettings({ default_region: "eu-west-1", data_residency: "eu" });

// Per-domain region override
await sendry.regions.setDomainRegion("dom_abc123", { region: "eu-west-1" });

// Region distribution analytics
const analytics = await sendry.regions.getRegionAnalytics({ from: "2025-01-01", to: "2025-01-31" });
```

### Team

```ts
// List members + seat usage
const team = await sendry.team.list();
console.log(`${team.seats.used}/${team.seats.limit} seats used`);

// Invite, update, remove
const member = await sendry.team.invite({ email: "colleague@acme.com", role: "member" });
await sendry.team.updateRole("mem_abc123", { role: "admin" });
await sendry.team.remove("mem_abc123");
```

### Billing

```ts
const plan = await sendry.billing.getPlan();
// plan.plan: "free" | "pro" | "business" | "enterprise"
// plan.billingPeriod: "monthly" | "annual"

const usage = await sendry.billing.getUsage();
// usage.emails_sent_this_period, usage.plan_limit, usage.overage_count, ...

// Create a Stripe Checkout session (redirect user to session.url)
const session = await sendry.billing.createCheckout({ plan: "pro", billingPeriod: "annual" });

// Create a Stripe Billing Portal session for subscription management
const portal = await sendry.billing.createPortal();
```

### Organizations

```ts
const org = await sendry.organizations.getCurrent();
await sendry.organizations.update({ name: "Acme Corp" });

// Branding (unsubscribe page, email footer)
const branding = await sendry.organizations.getBranding();
await sendry.organizations.updateBranding({
  brand_color: "#6366f1",
  brand_logo: "https://cdn.acme.com/logo.png",
});
```

### Inbound Emails

```ts
// List and retrieve received emails
const { data } = await sendry.inbound.list({ limit: 25 });
const email = await sendry.inbound.get("inb_abc123");

// Webhook forwarding configuration
const config = await sendry.inbound.getConfig();
await sendry.inbound.updateConfig({ url: "https://api.acme.com/inbound", secret: null });
```

### Notification Preferences

```ts
const prefs = await sendry.notificationPreferences.get();
await sendry.notificationPreferences.update({
  bounceAlerts: true,
  weeklyDigest: true,
});
```

### Test Emails

```ts
// View emails captured by test-mode API keys
const { data } = await sendry.testEmails.list();
const email = await sendry.testEmails.get("te_abc123");
console.log(email.html);
```

### System Status

```ts
const status = await sendry.status.getCurrent();
// status.status: "operational" | "degraded_performance" | "partial_outage" | "major_outage"
// status.sla_summary.sla_met: boolean

const history = await sendry.status.getHistory({ limit: 10 });
const latency = await sendry.status.getLatency({ component: "api-gateway", hours: 48 });
```

## Pagination

All list methods use cursor-based pagination. Pass `next_cursor` from one response as `cursor` in the next request:

```ts
let cursor: string | null = null;
let allEmails: Email[] = [];

do {
  const page = await sendry.emails.list({ limit: 100, cursor: cursor ?? undefined });
  allEmails.push(...page.data);
  cursor = page.next_cursor;
} while (page.has_more);
```

## Error Handling

The SDK throws typed errors so you can handle specific failure modes:

```ts
import {
  Sendry,
  SendryError,
  ApiError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NotFoundError,
  NetworkError,
} from "sendry-sdk";

try {
  await sendry.emails.send({ ... });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // 401 — invalid or missing API key
    console.error("Check your API key");
  } else if (error instanceof ValidationError) {
    // 422 — request body failed validation
    console.error("Validation failed:", error.details);
  } else if (error instanceof RateLimitError) {
    // 429 — too many requests
    const retryAfterMs = (error.retryAfter ?? 1) * 1000;
    setTimeout(retry, retryAfterMs);
  } else if (error instanceof NotFoundError) {
    // 404 — resource not found
  } else if (error instanceof ApiError) {
    // Other 4xx/5xx
    console.error(error.statusCode, error.code, error.message);
  } else if (error instanceof NetworkError) {
    // Fetch threw, DNS failed, or request timed out
    console.error("Network error:", error.message);
  }
}
```

## Webhook Verification

Verify that incoming webhook requests genuinely originate from Sendry using HMAC-SHA256:

```ts
import { verifyWebhookSignature } from "sendry-sdk";

// Express.js example (requires raw body)
app.post("/webhooks/sendry", express.raw({ type: "*/*" }), async (req, res) => {
  const isValid = await verifyWebhookSignature(
    req.body.toString(),
    req.headers["x-sendry-signature"] as string,
    process.env.SENDRY_WEBHOOK_SECRET!,
  );

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body.toString());
  console.log("Received event:", event.type);

  res.sendStatus(200);
});

// Or use the instance method:
const isValid = await sendry.verifyWebhookSignature(rawBody, signature, secret);
```

The signature is passed in the `x-sendry-signature` HTTP header as a hex-encoded HMAC-SHA256 digest, optionally prefixed with `sha256=`.

## Maintainers — OpenAPI snapshot workflow

The repo includes drift protection that hashes the API server's OpenAPI spec
and compares it against a committed snapshot. CI fails if the API surface
changes without a refreshed snapshot, so SDK updates can't silently fall
behind the server.

Two files live in this package:

- `openapi.json` — pretty-printed OpenAPI 3.0 spec, regenerated from the live
  Elysia app via `app.handle("/docs/json")` (no port binding required).
- `openapi.hash` — SHA-256 of `openapi.json`, the source of truth for the
  drift check.

Scripts (run from the repo root):

```bash
bun run sdk:snapshot   # rebuild openapi.json + openapi.hash from src/app.ts
bun run sdk:check      # fail if current spec hash differs from openapi.hash
```

`sdk:check` runs as part of `bun run ci`. When it fails:

1. Run `bun run sdk:snapshot` to refresh `openapi.json` and `openapi.hash`.
2. Diff `packages/sdk/openapi.json` to see which routes / schemas changed.
3. Update the SDK clients (`packages/sdk`, `packages/sdk-go`,
   `packages/sdk-python`) to match — this part is still manual; the
   snapshot is drift detection only, not codegen.
4. Commit both the SDK changes and the regenerated snapshot together.

## License

MIT
