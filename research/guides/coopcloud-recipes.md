---
title: Co-op Cloud Recipes
---

# Co-op Cloud and Recipes: When They Fit a Community Box

Co-op Cloud is a group of software projects. It describes itself as a [software commons and international federation](https://coopcloud.tech/) that builds democratic technology. Its main tool for running apps is `abra`, a command-line program. Apps are deployed from files called recipes.

This guide explains the terms, the maturity of the project, and when Co-op Cloud fits a Community Box. It is a guide, not a catalog entry.

Note: a Global Gathering 2026 participant recommended Co-op Cloud. This guide records that feedback. It is not evidence that the tool works well for any community.

## What Co-op Cloud Is

Co-op Cloud provides:

- **abra:** the command-line client. The project calls it the [flagship client and command-line tool](https://git.coopcloud.tech/toolshed/abra) for Co-op Cloud. It is written in Go and is libre software. Its [LICENSE file](https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE) is the GNU General Public License v3.
- **Recipes:** the configuration files that `abra` uses to deploy apps.
- **Docs:** operator and maintainer guides at [docs.coopcloud.tech](https://docs.coopcloud.tech/).

The docs describe operators as people who run a Co-op Cloud deployment. Operators are often [individuals or members of tech co-ops or collectives](https://docs.coopcloud.tech/operators/).

## What a Recipe Is

The project defines a recipe as [the configuration file used to deploy apps with the abra CLI](https://docs.coopcloud.tech/abra/recipes/). A web catalogue lists the recipes that exist. You look up an app there, then deploy it with `abra`.

The recipes page uses two different scales. Read both.

**CI score (0 to 3).** This scale measures automation in a recipe's continuous integration:

- 0: none.
- 1: basic deployment, with secrets and networks set by hand.
- 2: automatic secrets and networks.
- 3: the same as 2, plus a health check.

**Overall status (1 to 5).** This is a separate scale for the recipe as a whole:

- 5: everything in level 4, plus single sign-on.
- 4: upstream image, backups, email, health check, and integration testing.
- 3: upstream image, with one or two items from level 4 missing.
- 2: three or four items from level 4 missing, or no upstream image.
- 1: alpha.

The two scales measure different things. Check both before you deploy an app.

## Maturity Warning

The [docs home page](https://docs.coopcloud.tech/) says the project is still beta quality software. It asks users to consider this before they run it in production. The abra release shown in the repository is 0.13.0-beta.

For a community network, this means a Co-op Cloud deployment needs an operator who can read errors, update software, and fix problems without outside help.

## Hardware and Connectivity: Qualified Considerations

These are conditions to check, not universal requirements.

**Offline or local-only deployment.** The [operators handbook](https://docs.coopcloud.tech/operators/handbook/) says you may want to run Co-op Cloud directly on a device, for testing a recipe or for running apps outside the cloud. It warns that local hostnames stop Traefik from getting Let's Encrypt certificates. The suggested workaround is staging mode, wildcard certificates, and a self-signed certificate. Expect extra setup. Test it before you rely on it.

**ARM hardware.** The handbook quotes a community comment. It says ARM works only if the images you use support ARM, and that abra did not work on ARM at the time of that comment. Use multi-architecture or ARM images where you can. Check that abra runs on your board before you plan around it.

**x86 and internet access.** The handbook does not set a rule that the server must be x86 or always online. Check the architecture and the connectivity your recipes need, not a general rule.

## Simpler Options in This Repository

This repository already documents simpler platforms. Read these project notes first:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

This guide did not re-check those platforms. Use the repository notes for them.

Choose Co-op Cloud when the community has a clear need that the simpler platforms do not meet, and when at least one maintainer can work from a terminal and test updates.

## Open Questions

- (inferred) Co-op Cloud apps run on Docker Swarm. The brief for this guide says so, but the pages fetched for this guide did not confirm it. Check the [abra documentation](https://docs.coopcloud.tech/abra/) before relying on it.
- (inferred) A normal deployment needs internet access to download container images. Not confirmed in the fetched pages.
- The ARM statement comes from a community comment, not an official support matrix. Check current abra and image support before you buy hardware.
- The license of individual recipes was not checked. Check each recipe before reuse.

## Sources

Fetched 2026-10-30.

- https://coopcloud.tech/ (project description: software commons, federation, tools)
- https://docs.coopcloud.tech/ (beta quality warning, guides list)
- https://docs.coopcloud.tech/operators/ (who operators are)
- https://docs.coopcloud.tech/operators/handbook/ (offline deployment, local hostnames and certificates, ARM images and abra)
- https://docs.coopcloud.tech/abra/recipes/ (recipe definition, CI score 0 to 3, overall status 1 to 5)
- https://git.coopcloud.tech/toolshed/abra (abra description: flagship CLI, Go, libre software, release 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)
