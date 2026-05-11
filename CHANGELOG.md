# Changelog

All notable changes to `sendry` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-11

### Added

- Initial public release.
- `Sendry` client with resources: emails, domains, templates, api-keys,
  webhooks, analytics, suppression, unsubscribes, contacts, audiences,
  campaigns, deliverability, dedicated-ips, regions, team, billing,
  organizations, inbound, notification-preferences, test-emails, status.
- `verifyWebhookSignature` helper (HMAC-SHA256) — instance method and
  standalone export.
- Strongly typed responses, automatic retries on 5xx / network errors,
  request timeout + abort support.
- Dual ESM / CJS build with full `.d.ts` types.
