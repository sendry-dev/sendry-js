import type { HttpClient } from "../client.js";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesParams,
} from "../types.js";

export class NotificationPreferencesResource {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get the current user's notification preferences.
   *
   * @returns All notification preference settings.
   *
   * @example
   * ```ts
   * const prefs = await sendry.notificationPreferences.get();
   * console.log(prefs.bounce_alerts); // true
   * console.log(prefs.weekly_digest); // false
   * ```
   */
  async get(): Promise<NotificationPreferences> {
    return this.client.get<NotificationPreferences>("/v1/notification-preferences");
  }

  /**
   * Update notification preferences. Only provided fields are changed.
   *
   * @param params - Preference fields to update (all optional).
   * @returns Updated notification preferences.
   *
   * @example
   * ```ts
   * const updated = await sendry.notificationPreferences.update({
   *   bounceAlerts: true,
   *   weeklyDigest: true,
   *   dailySummary: false,
   * });
   * ```
   */
  async update(params: UpdateNotificationPreferencesParams): Promise<NotificationPreferences> {
    return this.client.put<NotificationPreferences>("/v1/notification-preferences", params);
  }
}
