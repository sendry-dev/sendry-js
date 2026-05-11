import { HttpClient } from "./client.js";
import { Emails } from "./resources/emails.js";
import { Domains } from "./resources/domains.js";
import { Templates } from "./resources/templates.js";
import { ApiKeys } from "./resources/api-keys.js";
import { Webhooks } from "./resources/webhooks.js";
import { Analytics } from "./resources/analytics.js";
import { Suppression } from "./resources/suppression.js";
import { Unsubscribes } from "./resources/unsubscribes.js";
import { Contacts } from "./resources/contacts.js";
import { Audiences } from "./resources/audiences.js";
import { Campaigns } from "./resources/campaigns.js";
import { Deliverability } from "./resources/deliverability.js";
import { DedicatedIps } from "./resources/dedicated-ips.js";
import { Regions } from "./resources/regions.js";
import { Team } from "./resources/team.js";
import { Billing } from "./resources/billing.js";
import { Organizations } from "./resources/organizations.js";
import { Inbound } from "./resources/inbound.js";
import { NotificationPreferencesResource } from "./resources/notification-preferences.js";
import { TestEmails } from "./resources/test-emails.js";
import { Status } from "./resources/status.js";
import { Automations } from "./resources/automations.js";
import { Events } from "./resources/events.js";
import type { SendryConfig } from "./types.js";

export class Sendry {
  public readonly emails: Emails;
  public readonly domains: Domains;
  public readonly templates: Templates;
  public readonly apiKeys: ApiKeys;
  public readonly webhooks: Webhooks;
  public readonly analytics: Analytics;
  public readonly suppression: Suppression;
  public readonly unsubscribes: Unsubscribes;
  public readonly contacts: Contacts;
  public readonly audiences: Audiences;
  public readonly campaigns: Campaigns;
  public readonly deliverability: Deliverability;
  public readonly dedicatedIps: DedicatedIps;
  public readonly regions: Regions;
  public readonly team: Team;
  public readonly billing: Billing;
  public readonly organizations: Organizations;
  public readonly inbound: Inbound;
  public readonly notificationPreferences: NotificationPreferencesResource;
  public readonly testEmails: TestEmails;
  public readonly status: Status;
  public readonly automations: Automations;
  public readonly events: Events;

  /**
   * Create a new Sendry SDK instance.
   *
   * @example
   * ```ts
   * // Simple usage
   * const sendry = new Sendry("sn_live_abc123");
   *
   * // With options
   * const sendry = new Sendry({
   *   apiKey: "sn_live_abc123",
   *   baseUrl: "https://api.sendry.online",
   * });
   * ```
   */
  constructor(apiKeyOrConfig: string | SendryConfig) {
    const config: SendryConfig =
      typeof apiKeyOrConfig === "string"
        ? { apiKey: apiKeyOrConfig }
        : apiKeyOrConfig;

    const client = new HttpClient(config);

    this.emails = new Emails(client);
    this.domains = new Domains(client);
    this.templates = new Templates(client);
    this.apiKeys = new ApiKeys(client);
    this.webhooks = new Webhooks(client);
    this.analytics = new Analytics(client);
    this.suppression = new Suppression(client);
    this.unsubscribes = new Unsubscribes(client);
    this.contacts = new Contacts(client);
    this.audiences = new Audiences(client);
    this.campaigns = new Campaigns(client);
    this.deliverability = new Deliverability(client);
    this.dedicatedIps = new DedicatedIps(client);
    this.regions = new Regions(client);
    this.team = new Team(client);
    this.billing = new Billing(client);
    this.organizations = new Organizations(client);
    this.inbound = new Inbound(client);
    this.notificationPreferences = new NotificationPreferencesResource(client);
    this.testEmails = new TestEmails(client);
    this.status = new Status(client);
    this.automations = new Automations(client);
    this.events = new Events(client);
  }

  /**
   * Verify a webhook signature using HMAC-SHA256.
   *
   * Sendry signs every webhook payload using the webhook's secret. Use this
   * method to verify that a request genuinely originated from Sendry before
   * processing it.
   *
   * @param payload - The raw request body as a string.
   * @param signature - The value of the `x-sendry-signature` header.
   * @param secret - The webhook secret from your Sendry dashboard.
   * @returns `true` if the signature is valid, `false` otherwise.
   *
   * @example
   * ```ts
   * // Express.js example
   * app.post("/webhooks/sendry", express.raw({ type: "*\/*" }), (req, res) => {
   *   const isValid = sendry.verifyWebhookSignature(
   *     req.body.toString(),
   *     req.headers["x-sendry-signature"] as string,
   *     process.env.SENDRY_WEBHOOK_SECRET!,
   *   );
   *   if (!isValid) return res.status(401).send("Invalid signature");
   *   // Process event...
   *   res.sendStatus(200);
   * });
   * ```
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    return verifyWebhookSignature(payload, signature, secret);
  }
}

/**
 * Verify a Sendry webhook signature using HMAC-SHA256.
 *
 * This is the standalone function version. It can be imported directly when
 * you do not have a `Sendry` instance available (e.g. in edge functions).
 *
 * @param payload - The raw request body as a string.
 * @param signature - The value of the `x-sendry-signature` header.
 * @param secret - The webhook secret from your Sendry dashboard.
 * @returns `true` if the signature is valid, `false` otherwise.
 *
 * @example
 * ```ts
 * import { verifyWebhookSignature } from "sendry-sdk";
 *
 * const isValid = verifyWebhookSignature(rawBody, signature, secret);
 * ```
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(payload);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Signature header may be prefixed with "sha256=" — strip it
    const sigHex = signature.startsWith("sha256=")
      ? signature.slice(7)
      : signature;

    // Decode hex signature to ArrayBuffer
    const sigBytes = new Uint8Array(
      sigHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    return await globalThis.crypto.subtle.verify("HMAC", cryptoKey, sigBytes, msgData);
  } catch {
    return false;
  }
}

// Re-export everything
export { Emails } from "./resources/emails.js";
export { Domains } from "./resources/domains.js";
export { Templates } from "./resources/templates.js";
export { ApiKeys } from "./resources/api-keys.js";
export { Webhooks } from "./resources/webhooks.js";
export { Analytics } from "./resources/analytics.js";
export { Suppression } from "./resources/suppression.js";
export { Unsubscribes } from "./resources/unsubscribes.js";
export { Contacts } from "./resources/contacts.js";
export { Audiences } from "./resources/audiences.js";
export { Campaigns } from "./resources/campaigns.js";
export { Deliverability } from "./resources/deliverability.js";
export { DedicatedIps } from "./resources/dedicated-ips.js";
export { Regions } from "./resources/regions.js";
export { Team } from "./resources/team.js";
export { Billing } from "./resources/billing.js";
export { Organizations } from "./resources/organizations.js";
export { Inbound } from "./resources/inbound.js";
export { NotificationPreferencesResource } from "./resources/notification-preferences.js";
export { TestEmails } from "./resources/test-emails.js";
export { Status } from "./resources/status.js";
export { Automations } from "./resources/automations.js";
export { Events } from "./resources/events.js";

export {
  SendryError,
  ApiError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NotFoundError,
  NetworkError,
} from "./errors.js";

export type * from "./types.js";

// Default export
export default Sendry;
