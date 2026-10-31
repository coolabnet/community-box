---
title: OONI Network Testing
---

# OONI Probe: Testing Whether Websites Are Blocked

OONI Probe is a free tool. It checks whether websites and apps are blocked on a network. It runs on a member's phone or computer. It is not a server service. This guide recommends personal devices as the deployment choice. The OONI command-line tool can also run on Linux and Raspberry Pi, but this guide does not recommend installing it on a Community Box or any shared server.

## What OONI Probe Does

OONI Probe runs tests from the device where it is installed. It can test whether a website or app is blocked. It can also measure network speed and performance. The [OONI home page](https://ooni.org/) describes it as a tool to test the blocking of websites and apps.

OONI Probe is available in these forms:

- **Mobile:** Android and iOS. The app is on Google Play, the App Store, and F-Droid ([install page](https://ooni.org/install)).
- **Desktop:** Windows and macOS ([install page](https://ooni.org/install)).
- **Command line:** Linux and macOS on the install page. The [CLI guide](https://ooni.org/support/ooni-probe-cli) lists macOS, Debian/Ubuntu, and Raspberry Pi as supported platforms.

## What Gets Published

The [OONI data policy](https://ooni.org/about/data-policy/) describes what is collected by default, unless you opt out of sending measurements:

- the date and time of each measurement, which cannot be turned off,
- a country code, derived from your IP address, which cannot be turned off,
- your network (ASN) and network type, such as Wi-Fi or mobile data, which cannot be turned off,
- the operating system (apps) or browser name,
- the measurements from the tests you run.

The policy says OONI does not aim to store IP addresses and removes them where it can. It also says the probe may send data that contains identifying information, such as IP addresses or HTTP headers.

[OONI Explorer](https://explorer.ooni.org/) publishes this open data. The [risks page](https://ooni.org/about/risks/) says measurements are published by default and that you can opt out in the app settings.

**Performance tests are different.** The data policy says that if you run the performance tests, M-Lab collects and publishes your IP address whatever your OONI Probe settings are. Opting out of OONI does not stop this. Do not run performance tests unless you accept that your IP address will be published.

## Automated Tests on Linux Installs

The [CLI guide](https://ooni.org/support/ooni-probe-cli) says that on Debian/Ubuntu and Raspberry Pi, automated testing is performed by default after install. These automated runs execute as the `ooniprobe` user, not as your login user.

To review results from those automated runs, the guide uses the `OONI_HOME` setting. For example:

- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe list`
- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe show <measurement-id>`

The guide documents the `ooniprobe autorun` commands (start, stop, status, and log commands), but it says these work only on macOS. It does not document how to disable automated tests on Debian/Ubuntu or Raspberry Pi. The config key `sharing.upload_results` controls uploads, not scheduling.

For that reason, do not install the CLI on Debian/Ubuntu or Raspberry Pi unless you have a tested way to stop automated runs. Check the current OONI documentation or ask the project before you install it there.

## Legal and Safety Risks

OONI's own [risks page](https://ooni.org/about/risks/) is the main source for this section. Read it in full before you install the app.

- Legal risk varies by country. OONI advises members to consult a lawyer licensed in their country before they install or run OONI Probe.
- In some countries, active network measurement may be illegal. The page says it may be treated as a form of espionage.
- Anyone who watches your internet traffic, such as an ISP, a government, or an employer, can see that you run OONI Probe.
- The Web Connectivity test contacts a wide range of sites. Some may be objectionable or illegal in some countries.
- OONI says users run the software at their own risk.

This guide does not give legal advice. Each member must decide for themselves, with a local lawyer if possible. The community should not push members to run the tests.

## Fit With a Community Network

OONI Probe fits as a companion app on members' own devices. The community does not need to host anything. The tests contact websites, so a device needs a connection while a test runs. On a network with no internet, the tests cannot reach the sites they check. A community with weak or no internet should not plan on regular OONI runs.

## Open Questions

- (inferred) The CLI may hold results until a connection returns. The fetched CLI guide did not confirm this.
- (inferred) Older phones may not run the mobile app well. Not tested or verified here.
- The OONI software license is linked from the risks page as [github.com/ooni/license](https://github.com/ooni/license). The text was not checked for this guide.
- The guide does not document how to disable automated CLI tests on Debian/Ubuntu or Raspberry Pi. Verify with OONI before relying on any method.

## Sources

Fetched 2026-10-30.

- https://ooni.org/ (OONI home page: what the project and app do)
- https://ooni.org/install (platforms: Android, iOS, Windows, macOS, Linux and macOS CLI)
- https://ooni.org/support/ooni-probe-cli (CLI platforms, automated tests by default on Debian/Ubuntu and Raspberry Pi, OONI_HOME review commands, autorun macOS only, sharing.upload_results)
- https://ooni.org/about/data-policy/ (default collected fields, M-Lab IP publication for performance tests)
- https://ooni.org/about/risks/ (publication default, opt-out, legal and safety risks, software license link)
- https://explorer.ooni.org/ (OONI Explorer: open data)
