---
title: Offline Transcription with Whisper
---

# Offline Speech-to-Text with Whisper: Feasibility Note

> **Feasibility note.** This note tests whether offline transcription is possible on community hardware. It does not recommend a setup. The scope decision (Q17) is still pending.

Speech-to-text turns spoken audio into written text. Some communities want to write down local meetings, interviews, or voice notes. This note asks whether that can run offline, on hardware a community network can afford.

## What Whisper Is

Whisper is a speech recognition model from OpenAI. Its code and model weights are released under the MIT License ([openai/whisper](https://github.com/openai/whisper)). The MIT License allows free use, including commercial use, with a copy of the license kept.

whisper.cpp is a C and C++ port of Whisper. It has no dependencies and runs on the CPU. Its license is also MIT ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)). Its platform list includes Linux, Windows, macOS, Android, iOS, WebAssembly, and Docker. It names Raspberry Pi as a platform, with a link to a discussion.

Both projects run inference on your own device. The whisper.cpp demo for iPhone is described as fully offline and on-device ([whisper.cpp README](https://github.com/ggml-org/whisper.cpp)). Test the offline claim on your own setup before you rely on it.

## Model Sizes and Memory

Whisper comes in five sizes: tiny, base, small, medium, and large. The OpenAI README lists these figures ([openai/whisper](https://github.com/openai/whisper)):

| Model | Parameters | Required VRAM (GPU) | Relative speed |
|---|---|---|---|
| tiny | 39 M | about 1 GB | about 10x |
| base | 74 M | about 1 GB | about 7x |
| small | 244 M | about 2 GB | about 4x |
| medium | 769 M | about 5 GB | about 2x |
| large | 1550 M | about 10 GB | 1x |

The README measured relative speed by transcribing English speech on an A100 GPU. Those numbers do not apply to a small CPU board.

The whisper.cpp README gives disk and memory figures for CPU use ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)):

| Model | Disk | Memory |
|---|---|---|
| tiny | 75 MiB | about 273 MB |
| base | 142 MiB | about 388 MB |
| small | 466 MiB | about 852 MB |
| medium | 1.5 GiB | about 2.1 GB |
| large | 2.9 GiB | about 3.9 GB |

Memory need grows with model size. A device with 2 GB of RAM may run tiny or base. Larger models need more RAM to run at all.

## Hardware Tiers

We found only one cited benchmark on a small board. It is a whisper.cpp results page, with times in milliseconds ([whisper.cpp issue 89](https://github.com/ggml-org/whisper.cpp/issues/89)). The page does not state the length of the audio clip. The whisper.cpp bench tool times only the encoder, on random data, not a full transcription of real audio ([bench README](https://github.com/ggml-org/whisper.cpp/blob/master/examples/bench/README.md)). Treat all times below as relative only, and do not read them as full transcription time.

- **Raspberry Pi 5:** no benchmark was found for this board. The only Pi row is a Raspberry Pi 4. Its encode time was about 13.8 seconds for tiny and about 30.6 seconds for base. (inferred for Pi 5: expect results at least as good as Pi 4, but test it)
- **ZimaBoard and Intel N-series:** no benchmark was found for these boards. The page has no N-series rows. Test before you plan on them.
- **NUC or other x86 boxes with more RAM:** the same page lists x86 rows. A Ryzen 9 5950X ran tiny in about 197 ms and large in about 8.1 seconds. Larger RAM lets you run the medium or large models. Speed still depends on the CPU.

Practical tiers, based on the figures above:

1. **Small board, 2 GB RAM:** tiny or base only. Expect slow results. (inferred)
2. **Board with 4 GB or more RAM:** small may fit. Measure the real speed. (inferred)
3. **x86 mini PC with more RAM:** medium may be workable. Measure first. (inferred)

## Language Coverage

The README says the multilingual models (tiny, base, small, medium, large) can handle non-English speech. The English-only versions (ending in .en) perform better for English, especially tiny.en and base.en ([openai/whisper](https://github.com/openai/whisper)). The turbo model is not trained for translation, so use a multilingual model if you need translation.

We did not check which languages Whisper supports well. Indigenous and local languages often have little training data. Accuracy may be low for them. (inferred) Test with native speakers before you rely on any transcript.

## Privacy Benefit

Running the model on your own device keeps the audio on your device. Nothing needs to leave the local network. This is the main reason to run it offline. (inferred from the design of local inference)

Check other risks. Transcripts can still reveal sensitive facts. Store them under the same rules as other community records.

## Open Questions

- Real speed on Raspberry Pi 5 with tiny, base, and small models. Not found.
- Clip length behind the whisper.cpp timing table. Not stated.
- Accuracy for specific indigenous or local languages. Not tested.
- Whether the scope decision (Q17) asks for live transcription or file transcription. Pending.
- Power use and heat on small boards during long jobs. Not checked.

## Sources

Fetched 2026-10-30.

- https://github.com/openai/whisper (MIT license, model sizes and VRAM table, multilingual and .en notes, turbo translation note)
- https://github.com/ggml-org/whisper.cpp (MIT license, C/C++ port, CPU-only, platform list, demo described as fully offline, CPU memory table)
- https://github.com/ggml-org/whisper.cpp/issues/89 (benchmark table with Raspberry Pi 4 and x86 rows, times in ms)
