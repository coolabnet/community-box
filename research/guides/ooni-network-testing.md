---
title: OONI Network Testing
---

# OONI Probe: Testing Whether Websites Are Blocked

OONI Probe is a free app. It checks whether websites and apps are blocked on a network. A member runs it on their own phone or computer. It is not a server, and it does not run on the Community Box.

This guide explains what OONI Probe does, where its results go, and what risks a member should consider before running it.

## What OONI Probe Does

OONI Probe runs tests from the device where it is installed. It can test whether a website or app is blocked. It can also measure network speed and performance. The OONI project describes it as a way to [test the blocking of websites and apps](https://ooni.org/).

OONI Probe is available in these forms:

- **Mobile:** Android and iOS. The app is on Google Play, the App Store, and F-Droid ([install page](https://ooni.org/install)).
- **Desktop:** Windows and macOS ([install page](https://ooni.org/install)).
- **Command line:** Linux and macOS ([install page](https://ooni.org/install), with instructions at [ooni.org/install/cli](https://ooni.org/install/cli)).

Each form has its own user guide on the OONI support site.

## Where Results Go

OONI publishes test results. The OONI Explorer site shows the data as [open data on internet censorship](https://explorer.ooni.org/). The Explorer page says the data was collected by the global OONI community, and it asks users to install OONI Probe and run tests to add to it.

By default, OONI sends each measurement to its collector. The collector publishes it on OONI Explorer and through the OONI API. A user can opt out in the app settings ([OONI risks page](https://ooni.org/about/risks/)).

The OONI risks page says published data includes:

- your approximate location,
- the network (ASN) you connect from,
- the time you ran the test.

OONI says it does not deliberately collect your IP address. The page also says an IP address may still appear in HTTP headers or other metadata.

## Legal and Safety Risks

OONI's own risks page is the main source for this section. Read it in full before you install the app.

Key points from that page:

- Legal risk varies by country. OONI advises members to [consult a lawyer licensed in their country](https://ooni.org/about/risks/) before they install or run OONI Probe.
- In some countries, active network measurement may be illegal. The page says it may be treated as a form of espionage.
- Anyone who watches your internet traffic, such as an ISP, a government, or an employer, can see that you run OONI Probe.
- The Web Connectivity test contacts a wide range of sites. Some may be objectionable or illegal in some countries.
- OONI states that users run the software at their own risk.

This guide does not give legal advice. Each member must decide for themselves, with a local lawyer if possible. The community should not push members to run the tests.

## Fit With a Community Network

OONI Probe fits as a companion app. Members install it on their own devices. The community does not need to host anything.

Network needs:

- The tests contact websites, so the device needs a connection while the test runs.
- Results are uploaded to OONI. The risks page describes this upload as the default path.
- On a network with no internet, the tests cannot reach the sites they check. A member can still install the app ahead of time.

A community network with weak or no internet should not plan on regular OONI runs. A member with a usable connection may run tests on the community's behalf, but only if that member accepts the risks above.

## Open Questions

- (inferred) The CLI may hold results until a connection returns. The docs fetched for this guide did not confirm this. Check the [CLI user guide](https://ooni.org/support/ooni-probe-cli) before relying on it.
- (inferred) Older phones may not run the mobile app well. Not tested or verified here.
- The OONI Probe software license is linked from the risks page as [github.com/ooni/license](https://github.com/ooni/license). The text was not checked for this guide.

## Sources

Fetched 2026-10-30.

- https://ooni.org/ (OONI home page: what the project and app do)
- https://ooni.org/install (platforms: Android, iOS, Windows, macOS, Linux CLI)
- https://ooni.org/install/cli (linked from the install page; not fetched directly)
- https://ooni.org/support/ooni-probe-cli (linked from the install page; not fetched directly)
- https://ooni.org/about/risks/ (publication default, published fields, legal and safety risks, software license link)
- https://explorer.ooni.org/ (OONI Explorer: open data, contribution by running tests)
