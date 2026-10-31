---
title: Community Radio and SDR Practices
---

# Radio, Messages, and Cameras for Local Monitoring: Practices

Some community networks cover areas with no internet. Members may need to send a short message, a water reading, or a sensor value by radio. Some also use cameras to watch shared sites. This note explains the basic tools and the rules to check first. It is a practices note, not a product guide. No tool is endorsed here.

## What SDR Is

Software-defined radio (SDR) uses software to handle radio signals that a receiver picks up. A low-cost USB dongle based on the RTL-SDR chip is a common start. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) describes it as a dongle of about $30 that turns a computer into a radio scanner. The page says the dongle can receive frequencies from 500 kHz up to 1.75 GHz, depending on the model. The usable range depends on the tuner chip inside.

The RTL-SDR software is an open project. Its [repository](https://github.com/osmocom/rtl-sdr) describes it as turning an RTL2832-based DVB dongle into an SDR receiver. The repository lists a GPL-2.0 license.

## Receive and Transmit Are Different

RTL-SDR dongles cannot transmit. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) says so directly. A receive-only dongle can listen to signals. It cannot send them.

Transmitting needs more care. Most countries require a licence or an authorisation before a station transmits on most frequencies. Some bands are license-exempt, but they have limits on power and use. (inferred) The International Telecommunication Union (ITU) publishes the Radio Regulations. They are the international treaty that governs how radio spectrum is shared ([ITU Radio Regulations](https://www.itu.int/pub/R-REG-RR)). The ITU page does not state the licensing rule in its own text. Check your national regulator for the rule that applies to you. (inferred for most countries; see Open Questions)

Practical rule: listen first. Do not transmit until you have checked the licence for your country, your frequency, and your power level.

## LoRa and Meshtastic for Short Messages

LoRa is a radio method for low-power, long-range links. The [LoRa Alliance](https://lora-alliance.org/about-lorawan/) says LoRaWAN operates in unlicensed radio bands. Unlicensed bands still have rules on power and time on air. Check them for your country. (inferred)

Meshtastic is an open-source project that runs on LoRa radios. Its [documentation](https://meshtastic.org/docs/) says it works without a phone for mesh messages and needs no dedicated router. Its [overview](https://meshtastic.org/docs/overview/) states these points:

- A message payload is at most 239 bytes. The client limits messages to about 200 bytes.
- Each relay reduces the hop limit by one. A node with hop limit 0 does not repeat the message.
- A client app is usually needed. It connects to the node by Bluetooth, Wi-Fi, Ethernet, or serial. Some devices have an on-device screen UI instead ([Meshtastic device UI](https://meshtastic.org/docs/configuration/device-uis/meshtasticui/)).
- Internet is optional. It is used only for MQTT, which connects a node to the internet.

The firmware repository lists a GPL-3.0 license ([meshtastic/firmware](https://github.com/meshtastic/firmware)).

This fits small text messages and sensor readings. It does not fit photos, video, or large files. Keep each message short and fixed in form, so that the receiver can parse it by hand.

Privacy warning: the default (LongFast) channel uses a publicly known key, so anyone with a Meshtastic radio can read messages on it. Do not send names, initials, or locations on the default channel. Use a private channel with its own key. Even on a private channel, packet metadata such as the sender node ID, timing, and hop count is visible to anyone who receives the packets ([Meshtastic encryption](https://meshtastic.org/docs/overview/encryption/)).

On a private channel, a water reading might follow this pattern: site code, date, time, reading, and reader initials. Use the same pattern each time.

The overview does not name supported boards. This note does not recommend one.

## Cameras and CCTV

Cameras that record people raise privacy issues. The EU data protection board guidance on video devices covers this in detail ([EDPB Guidelines 3/2019](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf)). Key points from that guidance:

- Put a warning sign at an easy-to-see point before the monitored area, about at eye level. Name the purpose and the controller, and say where to find more information.
- Keep stored footage only as long as needed. Erase it, ideally automatically, after a few days. Storage beyond 72 hours needs a stronger reason.
- Set a clear retention period for each purpose.

This guidance is written for the EU. Other countries have their own rules. Check yours.

Practical steps:

- Decide the purpose first. Watching a water tank is a different purpose from recording people at a gate.
- Point cameras at the thing you need to see, not at homes or paths used by people.
- Limit who can view footage. Tell people that cameras are in use.

## Human Monitoring of Territories

Cameras and radio help only when a person checks the data. Set a reading rota and an alert rule. Test before an emergency.

## Open Questions

- The licence rule for transmitting in your country and on your chosen frequency. Not checked here. (inferred that most countries need a licence for most transmitting)
- Power and time-on-air limits for LoRa in your region. Not checked here.
- Hardware choices for LoRa nodes and their cost. Not endorsed here.
- Local rules on CCTV and consent outside the EU. Not checked.
- Whether a local community can use shared cameras without consent from every person in view. Ask a local lawyer. (inferred)

## Sources

Fetched 2026-10-30.

- https://www.rtl-sdr.com/about-rtl-sdr/ (dongle is receive-only, about $30, frequency range notes)
- https://github.com/osmocom/rtl-sdr (RTL-SDR software description, GPL-2.0 license)
- https://www.itu.int/pub/R-REG-RR (ITU Radio Regulations, the international treaty for radio spectrum)
- https://lora-alliance.org/about-lorawan/ (LoRa and LoRaWAN, unlicensed bands)
- https://meshtastic.org/docs/ (Meshtastic overview, no phone needed for mesh messages)
- https://meshtastic.org/docs/overview/ (payload size, hop limit, client connection, MQTT is optional)
- https://meshtastic.org/docs/overview/encryption/ (default channel key is public; private channels expose packet metadata)
- https://meshtastic.org/docs/configuration/device-uis/meshtasticui/ (on-device screen UI on some devices)
- https://github.com/meshtastic/firmware (GPL-3.0 license)
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf (warning signs, first layer information, storage limits)
