import type { HttpClient } from "../client.js";
import type {
  BillingPlan,
  BillingUsage,
  CreateCheckoutParams,
  CreatePortalParams,
  CheckoutSession,
  PortalSession,
} from "../types.js";

export class Billing {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get the current billing plan and subscription status.
   *
   * @returns Current plan name, billing period, and whether a Stripe subscription exists.
   *
   * @example
   * ```ts
   * const plan = await sendry.billing.getPlan();
   * console.log(plan.plan); // "pro"
   * console.log(plan.billingPeriod); // "monthly"
   * ```
   */
  async getPlan(): Promise<BillingPlan> {
    return this.client.get<BillingPlan>("/v1/billing/plan");
  }

  /**
   * Get the current billing usage summary for the organisation.
   *
   * @returns Emails sent this period, plan limit, overage count and rate, and period end date.
   *
   * @example
   * ```ts
   * const usage = await sendry.billing.getUsage();
   * console.log(usage.emails_sent_this_period, "/", usage.plan_limit);
   * ```
   */
  async getUsage(): Promise<BillingUsage> {
    return this.client.get<BillingUsage>("/v1/billing/usage");
  }

  /**
   * Create a Stripe Checkout session for upgrading to a paid plan.
   *
   * @param params - Target plan, billing period, and optional redirect URLs.
   * @returns Stripe Checkout session URL to redirect the user to.
   *
   * @example
   * ```ts
   * const session = await sendry.billing.createCheckout({
   *   plan: "pro",
   *   billingPeriod: "annual",
   *   successUrl: "https://app.acme.com/billing?success=1",
   * });
   * window.location.href = session.url;
   * ```
   */
  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    return this.client.post<CheckoutSession>("/v1/billing/checkout", params);
  }

  /**
   * Create a Stripe Billing Portal session for managing the subscription.
   *
   * @param params - Optional return URL after leaving the portal.
   * @returns Stripe Billing Portal URL to redirect the user to.
   *
   * @example
   * ```ts
   * const portal = await sendry.billing.createPortal({
   *   returnUrl: "https://app.acme.com/billing",
   * });
   * window.location.href = portal.url;
   * ```
   */
  async createPortal(params?: CreatePortalParams): Promise<PortalSession> {
    return this.client.post<PortalSession>("/v1/billing/portal", params ?? {});
  }
}
