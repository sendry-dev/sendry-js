// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Cursor-paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

/** Cursor pagination query parameters */
export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

/** Simple deletion acknowledgement */
export interface DeleteResponse {
  deleted: boolean;
}

// ---------------------------------------------------------------------------
// Emails
// ---------------------------------------------------------------------------

export interface Tag {
  name: string;
  value: string;
}

export interface Attachment {
  /** File name including extension */
  filename: string;
  /** Base64-encoded file content */
  content: string;
  /** MIME type. Defaults to application/octet-stream */
  content_type?: string;
}

export interface SendEmailParams {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string;
  subject: string;
  html?: string;
  text?: string;
  tags?: Tag[];
  headers?: Record<string, string>;
  scheduled_at?: string;
  template_id?: string;
  variables?: Record<string, unknown>;
  attachments?: Attachment[];
  tracking?: boolean;
}

export interface SendEmailResponse {
  id: string;
  from: string;
  to: string[];
  subject: string;
  status: string;
  created_at: string;
}

export type EmailStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "bounced"
  | "complained"
  | "failed"
  | "cancelled";

export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  status: EmailStatus;
  created_at: string;
  sent_at: string | null;
  last_event?: string | null;
  attachments?: { filename: string; content_type: string }[];
}

export interface ListEmailsParams extends PaginationParams {
  status?: string;
}

export interface BatchEmailItem {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string;
  subject?: string;
  html?: string;
  text?: string;
  tags?: Tag[];
  variables?: Record<string, unknown>;
  attachments?: Attachment[];
}

export interface SendBatchParams {
  from?: string;
  subject?: string;
  template_id?: string;
  emails: BatchEmailItem[];
}

export interface BatchEmailResponse {
  data: { id: string; status: string }[];
}

export interface SendMarketingEmailParams {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  headers?: Record<string, string>;
  tags?: Tag[];
  unsubscribe_url: string;
  list_id?: string;
  scheduled_at?: string;
  template_id?: string;
}

export interface CancelEmailResponse {
  id: string;
  status: "cancelled";
}

// ---------------------------------------------------------------------------
// Domains
// ---------------------------------------------------------------------------

export interface DnsRecord {
  type: string;
  host: string;
  value: string;
  name: string;
  priority?: number;
  verified: boolean;
}

export interface Domain {
  id: string;
  name: string;
  status: "pending" | "verified" | "failed";
  dns_records: DnsRecord[];
  created_at: string;
}

export interface CreateDomainParams {
  name: string;
}

export interface VerifyDomainResponse {
  id: string;
  name: string;
  status: "pending" | "verified" | "failed";
  spf_verified: boolean;
  dkim_verified: boolean;
  dmarc_verified: boolean;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface TemplateVariable {
  type: string;
  required?: boolean;
  default?: unknown;
}

export interface CreateTemplateParams {
  name: string;
  subject?: string;
  html?: string;
  engine?: "html" | "react";
  variables?: Record<string, TemplateVariable>;
}

export interface UpdateTemplateParams {
  name?: string;
  subject?: string;
  html?: string;
  engine?: "html" | "react";
  variables?: Record<string, TemplateVariable>;
}

export interface Template {
  id: string;
  name: string;
  subject: string | null;
  html: string | null;
  engine: string;
  variables?: Record<string, TemplateVariable>;
  created_at: string;
  updated_at: string;
}

export interface RenderTemplateParams {
  variables?: Record<string, string>;
}

export interface RenderTemplateResponse {
  html: string;
  text: string;
}

// ---------------------------------------------------------------------------
// API Keys
// ---------------------------------------------------------------------------

export type ApiKeyScope = "full_access" | "sending_access" | "read_only";

export interface CreateApiKeyParams {
  name: string;
  scope?: ApiKeyScope;
}

export interface ApiKey {
  id: string;
  name: string;
  scope: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated {
  id: string;
  name: string;
  scope: string;
  key: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

export interface CreateWebhookParams {
  url: string;
  events: string[];
}

export interface UpdateWebhookParams {
  url?: string;
  events?: string[];
  active?: boolean;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookListItem {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface AnalyticsParams {
  from: string;
  to: string;
  granularity?: "hour" | "day" | "week" | "month";
  tag?: string;
  domain?: string;
}

export interface AnalyticsBucket {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
}

export interface AnalyticsSummary {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  complaint_rate: number;
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  timeseries: AnalyticsBucket[];
}

export interface LogsParams extends PaginationParams {
  email_id?: string;
  type?: string;
  to?: string;
  from_date?: string;
  to_date?: string;
}

export interface LogEvent {
  id: string;
  email_id: string;
  type: string;
  recipient: string;
  metadata?: unknown;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Suppression
// ---------------------------------------------------------------------------

export type SuppressionReason =
  | "hard_bounce"
  | "complaint"
  | "unsubscribe"
  | "manual";

export interface AddSuppressionParams {
  email: string;
  reason?: SuppressionReason;
}

export interface SuppressionEntry {
  email: string;
  reason: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Unsubscribes
// ---------------------------------------------------------------------------

export interface CreateUnsubscribeParams {
  email: string;
  list_id?: string;
  reason?: string;
}

export interface BatchUnsubscribeParams {
  emails: string[];
  list_id?: string;
  reason?: string;
}

export interface BatchUnsubscribeResponse {
  inserted: number;
}

export interface UnsubscribeEntry {
  id: string;
  email: string;
  list_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface ListUnsubscribesParams extends PaginationParams {
  email?: string;
  list_id?: string;
}

// ---------------------------------------------------------------------------
// Domains — BIMI
// ---------------------------------------------------------------------------

export interface ConfigureBimiParams {
  /** SVG logo URL (must be publicly accessible) */
  logo_url: string;
  /** Verified Mark Certificate URL (optional) */
  vmc_url?: string;
  /** BIMI selector name. Defaults to "default" */
  selector?: string;
}

export interface BimiConfig {
  id: string;
  domain_id: string;
  logo_url: string;
  vmc_url: string | null;
  selector: string;
  status: string;
  dns_record: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerifyBimiResponse {
  verified: boolean;
  status: string;
}

// ---------------------------------------------------------------------------
// Templates — additional
// ---------------------------------------------------------------------------

export interface TemplateStarter {
  id: string;
  name: string;
  description: string;
  subject: string;
  html: string;
  variables: string[];
  engine: string;
}

export interface VisualStarterSummary {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface CompileBlocksParams {
  /** Visual block design JSON */
  design: Record<string, unknown>;
  /** Variable values */
  variables?: Record<string, string>;
}

export interface RenderAdhocParams {
  /** Raw HTML to render */
  html: string;
  /** Template engine */
  engine?: "html" | "react" | "visual";
  /** Variable values */
  variables?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Analytics — additional
// ---------------------------------------------------------------------------

export interface CohortParams {
  from: string;
  to: string;
  granularity?: "day" | "week" | "month";
  metric?: "open_rate" | "click_rate" | "delivery_rate";
}

export interface CohortBucket {
  cohort_date: string;
  period_offset: number;
  total_sent: number;
  metric_value: number;
}

export interface CohortResponse {
  cohorts: CohortBucket[];
  granularity: string;
  metric: string;
}

export interface BenchmarkParams {
  from: string;
  to: string;
  granularity?: "day" | "week" | "month";
}

export interface BenchmarkBucket {
  date: string;
  your_delivery_rate: number;
  your_open_rate: number;
  your_click_rate: number;
  avg_delivery_rate: number;
  avg_open_rate: number;
  avg_click_rate: number;
  p50_delivery_rate: number;
  p50_open_rate: number;
  p50_click_rate: number;
  p75_delivery_rate: number;
  p75_open_rate: number;
  p75_click_rate: number;
}

export interface BenchmarkResponse {
  data: BenchmarkBucket[];
  benchmark_opt_in: boolean;
  org_count: number;
}

export interface BreakdownParams {
  from: string;
  to: string;
  group_by: "domain" | "template";
  limit?: number;
}

export interface BreakdownItem {
  id: string | null;
  name: string | null;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

export interface BreakdownResponse {
  data: BreakdownItem[];
  group_by: string;
}

export interface ComparisonPeriodStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  complaint_rate: number;
}

export interface ComparisonResponse {
  current: ComparisonPeriodStats;
  previous: ComparisonPeriodStats;
  changes: {
    sent_pct: number;
    delivered_pct: number;
    opened_pct: number;
    clicked_pct: number;
    bounced_pct: number;
    complained_pct: number;
    delivery_rate_delta: number;
    open_rate_delta: number;
    click_rate_delta: number;
    bounce_rate_delta: number;
    complaint_rate_delta: number;
  };
}

export interface ExportParams {
  from: string;
  to: string;
  granularity?: "hour" | "day" | "week" | "month";
  format?: "csv" | "json";
  domain?: string;
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export interface CreateContactParams {
  /** Contact email address */
  email: string;
  first_name?: string;
  last_name?: string;
  metadata?: Record<string, unknown>;
  /** Whether the contact is unsubscribed. Defaults to false */
  unsubscribed?: boolean;
  /** Audience ID to add the contact to */
  audience_id?: string;
}

export interface UpdateContactParams {
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  metadata?: Record<string, unknown> | null;
  unsubscribed?: boolean;
}

export interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  metadata: unknown | null;
  unsubscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListContactsParams extends PaginationParams {
  /** Filter by email (partial match) */
  email?: string;
  /** Filter by audience membership */
  audience_id?: string;
}

export interface BulkImportContactItem {
  email: string;
  first_name?: string;
  last_name?: string;
  metadata?: Record<string, unknown>;
  unsubscribed?: boolean;
}

export interface BulkImportContactsParams {
  contacts: BulkImportContactItem[];
  /** Audience ID to add all imported contacts to */
  audience_id?: string;
}

export interface BulkImportResult {
  created: number;
  updated: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Audiences
// ---------------------------------------------------------------------------

export interface CreateAudienceParams {
  name: string;
  description?: string;
}

export interface UpdateAudienceParams {
  name?: string;
  description?: string | null;
}

export interface Audience {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface AddContactsToAudienceParams {
  contact_ids: string[];
}

export interface AddContactsToAudienceResult {
  added: number;
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "paused"
  | "sent"
  | "cancelled";

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  complained_count: number;
  unsubscribed_count: number;
  failed_count: number;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  from: string;
  reply_to: string | null;
  preview_text: string | null;
  audience_id: string;
  template_id: string | null;
  html: string | null;
  text: string | null;
  status: string;
  scheduled_at: string | null;
  send_started_at: string | null;
  sent_at: string | null;
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
}

export interface CampaignListItem {
  id: string;
  name: string;
  subject: string;
  from: string;
  audience_id: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignParams {
  name: string;
  subject: string;
  from: string;
  reply_to?: string;
  preview_text?: string;
  audience_id: string;
  template_id?: string;
  html?: string;
  text?: string;
}

export interface UpdateCampaignParams {
  name?: string;
  subject?: string;
  from?: string;
  reply_to?: string | null;
  preview_text?: string | null;
  audience_id?: string;
  template_id?: string | null;
  html?: string | null;
  text?: string | null;
}

export interface ScheduleCampaignParams {
  /** ISO 8601 datetime to schedule the campaign */
  scheduled_at: string;
}

export interface CampaignActionResponse {
  id: string;
  status: string;
}

export interface ListCampaignsParams extends PaginationParams {
  /** Filter by status */
  status?: string;
}

// ---------------------------------------------------------------------------
// Deliverability
// ---------------------------------------------------------------------------

export interface ReputationQuery {
  domain_id?: string;
  days?: number;
}

export interface ReputationHistoryQuery {
  from?: string;
  to?: string;
}

export interface ReputationSnapshot {
  date: string;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_complained: number;
  total_opened: number;
  total_clicked: number;
  delivery_rate: number;
  bounce_rate: number;
  complaint_rate: number;
  open_rate: number;
  click_rate: number;
  reputation_score: number;
}

export interface ReputationResponse {
  current: {
    score: number;
    rating: string;
    factors: {
      bounceRate: number;
      complaintRate: number;
      deliveryRate: number;
      engagementRate: number;
    };
    recommendations: string[];
  };
  history: ReputationSnapshot[];
  domains: Array<{
    domain_id: string;
    domain_name: string;
    score: number;
    rating: string;
  }>;
}

export interface BlocklistQuery {
  target?: string;
  target_type?: "domain" | "ip";
}

export interface BlocklistCheckBody {
  target: string;
  target_type: "domain" | "ip";
}

export interface BlocklistCheckItem {
  id: string;
  target: string;
  target_type: string;
  provider: string;
  listed: boolean;
  listing_reason: string | null;
  response_time_ms: number | null;
  checked_at: string;
}

export interface BlocklistAlertItem {
  id: string;
  target: string;
  target_type: string;
  provider: string;
  status: string;
  listed_at: string;
  resolved_at: string | null;
}

export interface BlocklistResponse {
  checks: BlocklistCheckItem[];
  alerts: BlocklistAlertItem[];
  summary: {
    total_targets: number;
    listed_count: number;
    clean_count: number;
  };
}

export interface DeliverabilityReportQuery {
  domain_id?: string;
  days?: number;
}

export interface DeliverabilityReport {
  period: {
    from: string;
    to: string;
    days: number;
  };
  metrics: {
    total_sent: number;
    total_delivered: number;
    total_bounced: number;
    total_complained: number;
    delivery_rate: number;
    bounce_rate: number;
    complaint_rate: number;
    open_rate: number;
    click_rate: number;
  };
  reputation: {
    score: number;
    rating: string;
    trend: string;
  };
  blocklist_status: {
    total_lists_checked: number;
    active_listings: number;
    clean: boolean;
  };
  inbox_placement_estimate: {
    inbox_pct: number;
    spam_pct: number;
    missing_pct: number;
  };
  recommendations: string[];
  authentication: {
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
    bimi: boolean;
  };
}

// ---------------------------------------------------------------------------
// Dedicated IPs
// ---------------------------------------------------------------------------

export interface DedicatedIp {
  id: string;
  ip_address: string;
  provider: string;
  status: "provisioning" | "warming" | "active" | "inactive";
  warmup_day: number;
  warmup_progress: number;
  pool_name: string | null;
  assignments?: Array<{
    id: string;
    domain_id: string;
    domain_name: string;
    created_at: string;
  }>;
  created_at: string;
}

export interface ProvisionDedicatedIpParams {
  provider?: "ses" | "mailgun";
}

export interface AssignIpParams {
  domain_id: string;
}

export interface IpAssignment {
  id: string;
  ip_id: string;
  domain_id: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------

export interface Region {
  region_code: string;
  display_name: string;
  is_default: boolean;
}

export interface OrgRegionSettings {
  default_region: string | null;
  data_residency: string;
}

export interface UpdateOrgRegionParams {
  default_region?: string | null;
  data_residency?: "none" | "eu" | "us" | "ap";
}

export interface UpdateDomainRegionParams {
  region?: string | null;
}

export interface RegionAnalyticsParams {
  from: string;
  to: string;
}

export interface RegionAnalyticsItem {
  region: string;
  count: number;
  percentage: number;
}

export interface RegionAnalyticsResponse {
  data: RegionAnalyticsItem[];
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  org_id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
}

export interface ListTeamResponse {
  data: TeamMember[];
  seats: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  plan: string;
}

export interface InviteTeamMemberParams {
  email: string;
  role?: string;
}

export interface UpdateTeamMemberRoleParams {
  role: string;
}

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export interface BillingPlan {
  plan: string;
  hasSubscription: boolean;
  billingPeriod: "monthly" | "annual";
}

export interface BillingUsage {
  emails_sent_this_period: number;
  plan_limit: number;
  overage_count: number;
  overage_rate: number | null;
  period_end: string | null;
}

export interface CreateCheckoutParams {
  plan: string;
  billingPeriod?: "monthly" | "annual";
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreatePortalParams {
  returnUrl?: string;
}

export interface CheckoutSession {
  url: string;
}

export interface PortalSession {
  url: string;
}

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export interface Organization {
  id: string;
  name: string;
  plan: string;
  createdAt: string;
}

export interface UpdateOrganizationParams {
  name: string;
}

export interface BrandingSettings {
  brand_color: string;
  brand_logo: string | null;
  unsubscribe_heading: string | null;
  unsubscribe_message: string | null;
  unsubscribe_redirect_url: string | null;
}

export interface UpdateBrandingParams {
  brand_color?: string | null;
  brand_logo?: string | null;
  unsubscribe_heading?: string | null;
  unsubscribe_message?: string | null;
  unsubscribe_redirect_url?: string | null;
}

// ---------------------------------------------------------------------------
// Inbound
// ---------------------------------------------------------------------------

export interface InboundEmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  contentId?: string;
}

export interface InboundEmail {
  id: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string | null;
  text: string | null;
  html: string | null;
  headers: Record<string, string> | null;
  attachments: InboundEmailAttachment[];
  webhook_delivered: boolean;
  created_at: string;
}

export interface InboundEmailSummary {
  id: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string | null;
  text: string | null;
  html: string | null;
  headers: Record<string, string> | null;
  attachments: InboundEmailAttachment[];
  webhook_delivered: boolean;
  created_at: string;
}

export interface InboundConfig {
  url: string | null;
  secret: string | null;
}

export interface UpdateInboundConfigParams {
  url: string | null;
  secret?: string | null;
}

// ---------------------------------------------------------------------------
// Notification Preferences
// ---------------------------------------------------------------------------

export interface NotificationPreferences {
  id: string;
  bounce_alerts: boolean;
  complaint_alerts: boolean;
  delivery_failures: boolean;
  domain_issues: boolean;
  daily_summary: boolean;
  weekly_digest: boolean;
  monthly_report: boolean;
  all_events: boolean;
  delivery_events: boolean;
  engagement_events: boolean;
  compliance_events: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationPreferencesParams {
  bounceAlerts?: boolean;
  complaintAlerts?: boolean;
  deliveryFailures?: boolean;
  domainIssues?: boolean;
  dailySummary?: boolean;
  weeklyDigest?: boolean;
  monthlyReport?: boolean;
  allEvents?: boolean;
  deliveryEvents?: boolean;
  engagementEvents?: boolean;
  complianceEvents?: boolean;
}

// ---------------------------------------------------------------------------
// Test Emails
// ---------------------------------------------------------------------------

export interface TestEmailSummary {
  id: string;
  from: string;
  to: string[];
  subject: string;
  message_type: string;
  created_at: string;
}

export interface TestEmail {
  id: string;
  from: string;
  to: string[];
  cc: string[] | null;
  subject: string;
  html: string | null;
  text: string | null;
  message_type: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export interface IncidentUpdate {
  id: string;
  status: string;
  message: string;
  created_at: string;
}

export interface AffectedComponent {
  id: string;
  name: string;
  slug: string;
}

export interface Incident {
  id: string;
  title: string;
  status: string;
  impact: string;
  starts_at: string | null;
  ends_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  updates: IncidentUpdate[];
  affected_components: AffectedComponent[];
}

export interface StatusComponent {
  id: string;
  name: string;
  description: string | null;
  group: string | null;
  slug: string;
  status: string;
  uptime_90d: number;
  sla_target: number;
  sla_met: boolean;
}

export interface SlaSummary {
  target: number;
  current_uptime: number;
  sla_met: boolean;
}

export interface SystemStatus {
  status: string;
  components: StatusComponent[];
  active_incidents: Incident[];
  sla_summary: SlaSummary;
}

export interface LatencyHourBucket {
  hour: string;
  p50_ms: number | null;
  p95_ms: number | null;
  p99_ms: number | null;
  sample_count: number;
  target_met_pct: number;
}

export interface LatencyStats {
  component: string;
  target_ms: number;
  current_p50_ms: number | null;
  target_met: boolean;
  hourly: LatencyHourBucket[];
}

export interface GetLatencyParams {
  component?: string;
  hours?: number;
}

// ---------------------------------------------------------------------------
// Automations
// ---------------------------------------------------------------------------

export type AutomationStatus = "draft" | "active" | "paused" | "archived";

export type AutomationTriggerType =
  | "event"
  | "contact_added_to_segment"
  | "schedule"
  | "manual";

export type AutomationReentryPolicy = "once_per_contact" | "cooldown" | "always";

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  status: AutomationStatus;
  trigger_type: AutomationTriggerType;
  trigger_config: Record<string, unknown>;
  entry_segment_id: string | null;
  reentry_policy: string;
  reentry_cooldown_seconds: number | null;
  total_runs: number;
  active_runs: number;
  completed_runs: number;
  failed_runs: number;
  created_at: string;
  updated_at: string;
}

export type AutomationStepType = "send_email" | "wait" | "branch" | "ab_split";

export type AutomationStepConfig =
  | {
      type: "send_email";
      template_id?: string;
      from: string;
      reply_to?: string;
      subject?: string;
      html?: string;
      text?: string;
      message_type?: "transactional" | "marketing";
      topic_id?: string;
      variables?: Record<string, string>;
    }
  | { type: "wait"; duration_seconds: number }
  | {
      type: "branch";
      condition: {
        op: string;
        property?: string;
        value?: unknown;
        segment_id?: string;
        event_name?: string;
        within_seconds?: number;
      };
    }
  | {
      type: "ab_split";
      split: { a: number; b: number };
      seed?: string;
    };

export interface AutomationStep {
  id: string;
  automation_id: string;
  parent_step_id: string | null;
  branch_label: string | null;
  position: number;
  type: AutomationStepType;
  config: AutomationStepConfig & Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type AutomationRunStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";

export interface AutomationRun {
  id: string;
  automation_id: string;
  contact_id: string | null;
  contact_email: string;
  trigger_event_id: string | null;
  status: AutomationRunStatus;
  current_step_id: string | null;
  context: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type AutomationRunStepStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped"
  | "failed";

export interface AutomationRunStep {
  id: string;
  run_id: string;
  step_id: string;
  status: AutomationRunStepStatus;
  email_id: string | null;
  branch_taken: string | null;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  created_at: string;
}

export interface ListAutomationsParams extends PaginationParams {
  status?: AutomationStatus;
}

export interface CreateAutomationParams {
  name: string;
  description?: string;
  trigger_type: AutomationTriggerType;
  trigger_config?: Record<string, unknown>;
  entry_segment_id?: string;
  reentry_policy?: AutomationReentryPolicy;
  reentry_cooldown_seconds?: number;
}

export interface UpdateAutomationParams {
  name?: string;
  description?: string | null;
  trigger_config?: Record<string, unknown>;
  entry_segment_id?: string | null;
  reentry_policy?: AutomationReentryPolicy;
  reentry_cooldown_seconds?: number | null;
}

export interface AddAutomationStepParams {
  parent_step_id?: string | null;
  branch_label?: string | null;
  position?: number;
  config: AutomationStepConfig;
}

export interface UpdateAutomationStepParams {
  parent_step_id?: string | null;
  branch_label?: string | null;
  position?: number;
  config?: AutomationStepConfig;
}

export interface ListAutomationRunsParams extends PaginationParams {
  status?: string;
}

export interface CreateAutomationRunParams {
  contact_id?: string;
  contact_email?: string;
  context?: Record<string, unknown>;
}

export interface AutomationStepListResponse {
  data: AutomationStep[];
}

export interface AutomationRunStepListResponse {
  data: AutomationRunStep[];
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface IngestedEvent {
  id: string;
  external_id: string | null;
  name: string;
  contact_email: string | null;
  contact_id: string | null;
  payload: Record<string, unknown>;
  received_at: string;
  processed_at: string | null;
  triggered_runs: number;
  deduped?: boolean;
}

export interface IngestEventParams {
  name: string;
  event_id?: string;
  contact_email?: string;
  contact_id?: string;
  payload?: Record<string, unknown>;
}

export interface ListEventsParams extends PaginationParams {
  name?: string;
}

// ---------------------------------------------------------------------------
// SDK Configuration
// ---------------------------------------------------------------------------

export interface SendryConfig {
  /** API key (e.g. sn_live_... or sn_test_...) */
  apiKey: string;
  /** Base URL override. Defaults to https://api.sendry.online */
  baseUrl?: string;
  /** Custom fetch implementation. Defaults to globalThis.fetch */
  fetch?: typeof globalThis.fetch;
  /** Default timeout in milliseconds. Defaults to 30000 (30s) */
  timeout?: number;
  /** Default headers merged into every request */
  headers?: Record<string, string>;
  /** Number of retries for 5xx / network errors. Defaults to 2 */
  retries?: number;
}
