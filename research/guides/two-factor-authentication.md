---
title: Two-Factor Authentication
---

# Two-Factor Authentication for Community Server Admins

Two-factor authentication (2FA) asks for a second proof of identity at login. A password is the first factor. A code from a phone app is a common second factor. This guide explains why admin accounts on a local server should use 2FA. It also explains how the common method works offline, which platforms support it, and how to plan for lost devices.

This is a guide, not a product. The community does not need to install a new tool. It needs a habit and a plan.

## Why Admin Accounts Need It

An admin account can change settings, read data, and add users. On a local server that holds critical community data, one stolen password could expose everything. A second factor makes a stolen password much less useful.

Stronger passwords also help. The YunoHost security guide says that [weak passwords are arguably the top reason servers get hacked](https://doc.yunohost.org/en/admin/security/). It advises members to use long passphrases and a password manager. It also advises creating accounts only for people you trust. Use 2FA together with these habits.

## How Time-Based Codes Work Offline

Most 2FA apps use TOTP, the time-based one-time password method. The IETF defines it in [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238). The spec says:

- The phone and the server must share a secret key.
- Both sides must know the current Unix time.
- Both sides must use the same time step.
- TOTP builds on HOTP (RFC 4226) as its base.

The RFC describes no network step. The code is made from the shared secret and the clock. This suggests TOTP works offline once the secret is set up (inferred from the spec; test it on your setup). The clock matters. If the phone's time drifts from the server's time, codes fail.

Open-source apps that do TOTP include:

- [Aegis](https://github.com/beemdevelopment/Aegis): described as a free, secure, open source Android app for two-step verification tokens.
- [FreeOTP+](https://github.com/helloworld1/FreeOTPPlus): listed as an open-source alternative by the FreeOTP project ([freeotp-android repository](https://github.com/freeotp/freeotp-android)).

Check each app's current release and license before you recommend it.

## Platforms in This Repository

Check the platform before you plan. Support differs a lot.

**Nextcloud** supports 2FA:

- 2FA is optional by default. Users turn it on in their personal settings. Admins can [enforce it system-wide or for selected groups](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html) under Administration Settings → Security.
- An admin must enable at least one 2FA provider before users can use 2FA ([Nextcloud admin manual](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html)).
- Users can generate backup codes from their personal Second-factor Auth settings ([Nextcloud user manual](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html)).

**YunoHost** does not show native 2FA in its security guide. The guide lists 2FA as a [mid-term goal](https://doc.yunohost.org/en/admin/security/), not a feature. Until that changes, do not assume the YunoHost admin panel asks for a second factor. The same guide advises SSH keys in place of SSH passwords.

Other platforms in this repository were not checked for this guide. Check their official docs before you plan 2FA for them.

## Backup Codes and Recovery

Plan for a lost or stolen phone before it happens.

- **Generate backup codes** when you turn on 2FA. The Nextcloud user manual says to [generate them and store them safely](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html).
- **Store backup codes apart from the phone.** The same manual says not to keep them with the second-factor device, so that losing one does not mean losing both.
- **Write down the recovery path.** Who can reset an account? Where are the backup codes kept? Who holds the server password?
- **Test recovery** once, on a non-critical account, before you need it.

## Shared Admin Accounts

Shared logins make it hard to know who changed what. They also make 2FA harder to manage, because one phone may hold the code for everyone.

Prefer one named admin account per trusted person. If a community must share one admin login, record who holds the second factor and keep the backup codes in a locked place. Review the list of admins often. The YunoHost guide's advice to create accounts only for trusted people applies here.

## Open Questions

- (inferred) Nextcloud's TOTP provider works with RFC 6238 apps such as Aegis. The official admin page was fetched, but the exact line was not confirmed in the fetched text.
- (inferred) Nextcloud's "Two-Factor Admin Support" app can issue a one-time login code when a user loses both the second factor and the backup codes. An older manual mentions it. Check the current Nextcloud docs before you rely on it.
- Whether TOTP works fully offline on a given phone and server has not been tested.
- The YunoHost 2FA status may change. Check the current YunoHost release notes.

## Sources

Fetched 2026-10-30.

- https://www.rfc-editor.org/rfc/rfc6238 (TOTP requirements R1-R3)
- https://github.com/beemdevelopment/Aegis (Aegis description)
- https://github.com/freeotp/freeotp-android (listed alternatives, including FreeOTP+)
- https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html (2FA optional by default, enforcement, provider requirement)
- https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html (backup codes, storage advice)
- https://doc.yunohost.org/en/admin/security/ (password advice, SSH keys, 2FA as mid-term goal)
