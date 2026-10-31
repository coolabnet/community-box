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

Recipes have a quality score. The recipes page lists four levels:

- 0: none,
- 1: basic deployment, with secrets and networks set by hand,
- 2: automatic secrets and networks,
- 3: the same as 2, plus a health check.

A higher score means less manual work. Check the score before you deploy an app.

## Maturity Warning

The docs say the project is [still beta quality software](https://docs.coopcloud.tech/). The page warns users to consider this before they run it in production. The abra release shown in the repository is 0.13.0-beta.

For a community network, this means a Co-op Cloud deployment needs an operator who can read errors, update software, and fix problems without outside help.

## When It Fits a Community Box

Co-op Cloud may fit when all of these are true:

- The server is an x86 machine with enough memory and storage, and it is connected to the internet.
- At least one maintainer is comfortable with the command line.
- The community wants apps that the Co-op Cloud catalogue already packages.
- The community accepts that the software is beta.

It is a poor fit when the server must run offline, when no one wants to use a terminal, or when the team cannot test updates.

## Simpler Options in This Repository

This repository already documents simpler platforms. Read these project notes first:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

This guide did not re-check those platforms. Use the repository notes for them.

Choose Co-op Cloud only when the community has a clear need that the simpler platforms do not meet.

## Open Questions

- (inferred) Co-op Cloud apps run on Docker Swarm. The brief for this guide says so, but the pages fetched for this guide did not confirm it. Check the [abra documentation](https://docs.coopcloud.tech/abra/) before relying on it.
- (inferred) A deployment needs internet access to download container images. Not confirmed in the fetched pages.
- The license of individual recipes was not checked. Check each recipe before reuse.
- The abra docs page at docs.coopcloud.tech/abra/ was not fetched for this guide.

## Sources

Fetched 2026-10-30.

- https://coopcloud.tech/ (project description: software commons, federation, tools)
- https://docs.coopcloud.tech/ (beta quality warning, guides list)
- https://docs.coopcloud.tech/operators/ (who operators are)
- https://docs.coopcloud.tech/abra/recipes/ (recipe definition, catalogue, CI score levels)
- https://git.coopcloud.tech/toolshed/abra (abra description: flagship CLI, Go, libre software, release 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)
