---
title: Kiwix Language Packs
---

# Choosing Kiwix Language Packs for Offline Wikipedia

Kiwix gives you offline copies of websites, mostly Wikipedia. The project is a nonprofit. Its own site says it works to make [free knowledge accessible where the Internet is not](https://kiwix.org/en/). A Kiwix content pack is one large file called a ZIM file. Copy it to a device and read it with no internet.

This guide helps you pick a language pack for a community server or box. It does not test the reader on your hardware. Test before you deploy.

## What Kiwix Offers

The Kiwix site lists a reader app, a catalog of content, and server options ([Kiwix home page](https://kiwix.org/en/)). Check the download pages for the platforms you need.

## Finding a Language Pack

The Kiwix library is the catalog of ZIM files. Its address is library.kiwix.org. The library site blocked automated access during this research, so the steps below are inferred. Check them on the live site.

1. Open the catalog and filter by language.
2. Pick the Wikipedia entry for that language. Each language has its own Wikipedia edition.
3. Note the language code in the file name. Examples: pt for Portuguese, es for Spanish, sw for Swahili, qu for Quechua, gn for Guarani.

The raw file listing is at [download.kiwix.org](https://lb.download.kiwix.org/zim/wikipedia/). It shows every file, its date, and its size.

## What the Variant Names Mean

Each Wikipedia language has up to three variants in the file listing: nopic, mini, and maxi.

- **nopic** keeps the articles and drops most pictures. It is the usual choice for offline use.
- **mini** seems to hold only article intros. (inferred from the file sizes)
- **maxi** is the largest. It holds the most content and pictures.

We could not confirm these meanings on a Kiwix page. Treat the descriptions above as inferred until you check the Kiwix documentation.

## Example Sizes

These sizes come from the file listing at download.kiwix.org. Each new dump changes the sizes.

| Language | Code | Mini | Nopic | Maxi |
|---|---|---|---|---|
| Portuguese | pt | 1.6 GB (2026-05) | 6.6 GB (2026-05) | 19 GB (2026-05) |
| Spanish | es | 3.8 GB (2026-10) | 12 GB (2026-10) | 34 GB (2026-10) |
| Swahili | sw | not listed | 248 MB (2026-10) | 713 MB (2026-10) |
| Quechua | qu | not listed | 57 MB (2026-10) | 229 MB (2026-10) |
| Guarani | gn | not listed | 14 MB (2026-10) | 64 MB (2026-10) |

Swahili, Quechua, and Guarani have no mini file in the listing. Small languages have small packs. The small size may also mean fewer articles. (inferred; compare article counts on each Wikipedia edition)

We did not check packs for Asian languages. See Open Questions.

## Planning Storage

- Start with the file size, then add free space for the reader and for copying. Plan for about 20 percent extra. (inferred; test on your device)
- Size the disk for all packs you plan to keep. Example: Spanish nopic plus Portuguese maxi is about 31 GB before extra space.
- Copy files over your local network when you can. Download once on a fast link, then share. See the external storage guide in this folder for disk choices.

## Updating Packs

Wikipedia dumps are replaced on a schedule. The date in the file name shows the dump date. A newer date means newer articles.

- Keep the old file until the new file opens and searches correctly.
- Update on a fixed schedule. Once or twice a year is a common plan. (inferred)

## Wikipedia Text and Local AI Models

Using Wikipedia text to train or tune a local AI model is a different topic. It needs its own check. Wikipedia text is released under CC BY-SA. The [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) say contributors license their text under CC BY-SA 4.0, and that reuse must credit the authors. Changed text must also be shared under CC BY-SA. Before you train a model, check the license terms for the model output, the credit rules, and whether the text is accurate and fair for your community. Get advice from someone who knows the license rules. (inferred; this note is not legal advice)

## Open Questions

- The exact catalog filter steps on library.kiwix.org. (inferred; the site blocked automated access)
- The meaning of nopic, mini, and maxi on an official Kiwix page. (inferred)
- Whether packs exist for Asian languages used in your region. Not checked.
- Whether the download listing offers checksum files for verifying copies. Not checked.
- Whether the Kiwix reader runs well on your target device. Not tested.

## Sources

Fetched 2026-10-30.

- https://kiwix.org/en/ (Kiwix mission, offline use, reader and server options)
- https://lb.download.kiwix.org/zim/wikipedia/ (Wikipedia ZIM file names, dates, sizes; the download address redirects here)
- https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use (CC BY-SA 4.0 and attribution terms for user text, section 7)
