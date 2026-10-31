---
title: Rádio Comunitária e Práticas de SDR
sourcePath: guides/community-radio-sdr.md
sourceHash: 9a689f5efd5359ca
translatedBy: glm-4.6
---

# Rádio, Mensagens e Câmeras para Monitoramento Local: Práticas

Algumas redes comunitárias cobrem áreas sem internet. Os membros podem precisar enviar uma mensagem curta, uma leitura de água ou um valor de sensor por rádio. Alguns também usam câmeras para vigiar locais compartilhados. Esta nota explica as ferramentas básicas e as regras a verificar primeiro. É uma nota de práticas, não um guia de produtos. Nenhuma ferramenta é recomendada aqui.

## O Que É SDR

O rádio definido por software (SDR) usa software para processar sinais de rádio que um receptor capta. Um dongle USB de baixo custo baseado no chip RTL-SDR é um começo comum. A [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) o descreve como um dongle de cerca de US$ 30 que transforma um computador em um scanner de rádio. A página diz que o dongle pode receber frequências de 500 kHz até 1,75 GHz, dependendo do modelo. A faixa utilizável depende do chip sintonizador interno.

O software RTL-SDR é um projeto aberto. Seu [repositório](https://github.com/osmocom/rtl-sdr) o descreve como a transformação de um dongle DVB baseado em RTL2832 em um receptor SDR. O repositório lista uma licença GPL-2.0.

## Receber e Transmitir São Coisas Diferentes

Dongles RTL-SDR não podem transmitir. A [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) diz isso diretamente. Um dongle apenas receptor pode ouvir sinais. Não pode enviá-los.

Transmitir exige mais cuidado. A maioria dos países exige uma licença ou autorização antes de uma estação transmitir na maioria das frequências. Algumas faixas são isentas de licença, mas têm limites de potência e uso. (inferido) A União Internacional de Telecomunicações (ITU) publica o Regulamento de Radiocomunicações. É o tratado internacional que governa como o espectro de rádio é compartilhado ([ITU Radio Regulations](https://www.itu.int/pub/R-REG-RR)). A página da ITU não declara a regra de licenciamento em seu próprio texto. Consulte seu regulador nacional para a regra que se aplica a você. (inferido para a maioria dos países; ver Questões Abertas)

Regra prática: ouça primeiro. Não transmita até ter verificado a licença para seu país, sua frequência e seu nível de potência.

## LoRa e Meshtastic para Mensagens Curtas

LoRa é um método de rádio para enlaces de longo alcance e baixa potência. A [LoRa Alliance](https://lora-alliance.org/about-lorawan/) diz que a LoRaWAN opera em faixas de rádio não licenciadas. Faixas não licenciadas ainda têm regras sobre potência e tempo no ar. Verifique-as para seu país. (inferido)

Meshtastic é um projeto de código aberto que roda em rádios LoRa. Sua [documentação](https://meshtastic.org/docs/) diz que funciona sem um telefone para mensagens em malha e não precisa de um roteador dedicado. Sua [visão geral](https://meshtastic.org/docs/overview/) afirma estes pontos:

- O payload de uma mensagem é de no máximo 239 bytes. O cliente limita as mensagens a cerca de 200 bytes.
- Cada retransmissão reduz o limite de saltos em um. Um nó com limite de saltos 0 não repete a mensagem.
- Um aplicativo cliente ainda é necessário. Ele se conecta ao nó por Bluetooth, Wi-Fi, Ethernet ou serial.
- Internet é opcional. É usada apenas para MQTT, que conecta um nó à internet.

O repositório do firmware lista uma licença GPL-3.0 ([meshtastic/firmware](https://github.com/meshtastic/firmware)).

Isso serve para mensagens curtas de texto e leituras de sensores. Não serve para fotos, vídeo ou arquivos grandes. Mantenha cada mensagem curta e fixa em forma. Por exemplo, uma leitura de água pode seguir este padrão: código do local, data, hora, leitura e iniciais do leitor. Use o mesmo padrão toda vez para que o receptor possa analisá-la manualmente.

A visão geral não nomeia placas suportadas. Esta nota não recomenda nenhuma.

## Câmeras e CFTV

Câmeras que filmam pessoas levantam questões de privacidade. A orientação do conselho europeu de proteção de dados sobre dispositivos de vídeo cobre isso em detalhes ([EDPB Guidelines 3/2019](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf)). Pontos-chave dessa orientação:

- Coloque um placa de aviso em um ponto de fácil visibilidade antes da área monitorada, aproximadamente na altura dos olhos. Nomeie a finalidade e o controlador, e diga onde encontrar mais informações.
- Mantenha as gravações armazenadas apenas pelo tempo necessário. Apague-as, idealmente automaticamente, após alguns dias. Armazenamento além de 72 horas exige uma justificativa mais forte.
- Defina um período de retenção claro para cada finalidade.

Essa orientação foi escrita para a UE. Outros países têm suas próprias regras. Verifique as suas.

Passos práticos:

- Decida primeiro a finalidade. Vigiar uma caixa d'água é uma finalidade diferente de filmar pessoas em um portão.
- Aponte as câmeras para o que você precisa ver, não para casas ou caminhos usados por pessoas.
- Limite quem pode ver as gravações. Avise as pessoas que câmeras estão em uso.

## Monitoramento Humano de Territórios

Câmeras e rádio só ajudam quando uma pessoa verifica os dados. Defina uma escala de leitura e uma regra de alerta. Teste antes de uma emergência.

## Questões Abertas

- A regra de licenciamento para transmitir em seu país e na sua frequência escolhida. Não verificada aqui. (inferido que a maioria dos países exige licença para a maioria das transmissões)
- Limites de potência e tempo no ar para LoRa em sua região. Não verificados aqui.
- Escolhas de hardware para nós LoRa e seu custo. Não recomendadas aqui.
- Regras locais sobre CFTV e consentimento fora da UE. Não verificadas.
- Se uma comunidade local pode usar câmeras compartilhadas sem consentimento de cada pessoa em cena. Consulte um advogado local. (inferido)

## Fontes

Obtidas em 2026-10-30.

- https://www.rtl-sdr.com/about-rtl-sdr/ (dongle é apenas receptor, cerca de US$ 30, notas sobre faixa de frequência)
- https://github.com/osmocom/rtl-sdr (descrição do software RTL-SDR, licença GPL-2.0)
- https://www.itu.int/pub/R-REG-RR (ITU Radio Regulations, o tratado internacional para espectro de rádio)
- https://lora-alliance.org/about-lorawan/ (LoRa e LoRaWAN, faixas não licenciadas)
- https://meshtastic.org/docs/ (visão geral do Meshtastic, sem necessidade de telefone para mensagens em malha)
- https://meshtastic.org/docs/overview/ (tamanho do payload, limite de saltos, conexão de cliente, MQTT é opcional)
- https://github.com/meshtastic/firmware (licença GPL-3.0)
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf (placas de aviso, informações de primeira camada, limites de armazenamento)