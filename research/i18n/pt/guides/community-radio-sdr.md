---
title: Rádio Comunitária e Práticas de SDR
sourcePath: guides/community-radio-sdr.md
sourceHash: 6f735e37bdff31a2
translatedBy: glm-4.6
---

# Rádio, Mensagens e Câmeras para Monitoramento Local: Práticas

Algumas redes comunitárias cobrem áreas sem internet. Os integrantes podem precisar enviar uma mensagem curta, uma leitura de água ou um valor de sensor por rádio. Alguns também usam câmeras para observar locais compartilhados. Esta nota explica as ferramentas básicas e as regras a verificar primeiro. É uma nota de práticas, não um guia de produtos. Nenhuma ferramenta é recomendada aqui.

## O que é SDR

O rádio definido por software (SDR) usa software para processar sinais de rádio captados por um receptor. Um dongle USB de baixo custo baseado no chip RTL-SDR é um começo comum. A [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) o descreve como um dongle de cerca de US$ 30 que transforma um computador em um scanner de rádio. A página diz que o dongle pode receber frequências de 500 kHz até 1,75 GHz, dependendo do modelo. A faixa utilizável depende do chip sintonizador interno.

O software RTL-SDR é um projeto aberto. Seu [repositório](https://github.com/osmocom/rtl-sdr) o descreve como a transformação de um dongle DVB baseado em RTL2832 em um receptor SDR. O repositório lista uma licença GPL-2.0.

## Receber e Transmitir São Coisas Diferentes

Os dongles RTL-SDR não podem transmitir. A [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) diz isso diretamente. Um dongle somente de recepção pode escutar sinais. Não pode enviá-los.

Transmitir exige mais cuidado. A maioria dos países exige uma licença ou autorização antes que uma estação transmita na maioria das frequências. Algumas faixas são isentas de licença, mas têm limites de potência e de uso. (inferido) A União Internacional de Telecomunicações (UIT) publica o Regulamento de Radiocomunicações. É o tratado internacional que rege como o espectro de rádio é compartilhado ([UIT Regulamento de Radiocomunicações](https://www.itu.int/pub/R-REG-RR)). A página da UIT não declara a regra de licenciamento em seu próprio texto. Consulte seu regulador nacional para a regra que se aplica a você. (inferido para a maioria dos países; ver Perguntas Abertas)

Regra prática: escute primeiro. Não transmita até ter verificado a licença do seu país, sua frequência e seu nível de potência.

## LoRa e Meshtastic para Mensagens Curtas

LoRa é um método de rádio para links de longo alcance e baixo consumo. A [LoRa Alliance](https://lora-alliance.org/about-lorawan/) diz que o LoRaWAN opera em faixas de rádio não licenciadas. Faixas não licenciadas ainda têm regras de potência e tempo no ar. Verifique-as para o seu país. (inferido)

Meshtastic é um projeto de código aberto que roda em rádios LoRa. Sua [documentação](https://meshtastic.org/docs/) diz que funciona sem telefone para mensagens em malha e não precisa de roteador dedicado. Sua [visão geral](https://meshtastic.org/docs/overview/) afirma estes pontos:

- Uma carga útil de mensagem é de no máximo 239 bytes. O cliente limita as mensagens a cerca de 200 bytes.
- Cada retransmissão reduz o limite de saltos em um. Um nó com hop limit 0 não repete a mensagem.
- Normalmente é necessário um aplicativo cliente. Ele se conecta ao nó por Bluetooth, Wi-Fi, Ethernet ou serial. Alguns dispositivos têm uma interface de tela no próprio dispositivo ([Meshtastic device UI](https://meshtastic.org/docs/configuration/device-uis/meshtasticui/)).
- A internet é opcional. É usada apenas para MQTT, que conecta um nó à internet.

O repositório do firmware lista uma licença GPL-3.0 ([meshtastic/firmware](https://github.com/meshtastic/firmware)).

Isso serve para mensagens de texto curtas e leituras de sensores. Não serve para fotos, vídeo ou arquivos grandes. Mantenha cada mensagem curta e de forma fixa, para que o receptor possa interpretá-la manualmente.

Aviso de privacidade: o canal padrão (LongFast) usa uma chave conhecida publicamente, então qualquer pessoa com um rádio Meshtastic pode ler as mensagens nele. Não envie nomes, iniciais ou locais no canal padrão. Use um canal privado com sua própria chave. Mesmo em um canal privado, metadados de pacotes, como o ID do nó remetente, o horário e a contagem de saltos, ficam visíveis para quem recebe os pacotes ([Meshtastic encryption](https://meshtastic.org/docs/overview/encryption/)).

Em um canal privado, uma leitura de água pode seguir este padrão: código do local, data, hora, leitura e iniciais do leitor. Use o mesmo padrão todas as vezes.

A visão geral não cita placas suportadas. Esta nota não recomenda nenhuma.

## Câmeras e CCTV

Câmeras que gravam pessoas levantam questões de privacidade. As diretrizes do conselho europeu de proteção de dados sobre dispositivos de vídeo cobrem isso em detalhe ([EDPB Guidelines 3/2019](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf)). Pontos-chave dessas diretrizes:

- Coloque um aviso em um ponto de fácil visualização antes da área monitorada, aproximadamente na altura dos olhos. Indique a finalidade e o responsável, e diga onde encontrar mais informações.
- Mantenha as gravações armazenadas apenas pelo tempo necessário. Apague-as, idealmente automaticamente, após alguns dias. Armazenamento além de 72 horas exige um motivo mais forte.
- Defina um período de retenção claro para cada finalidade.

Essas diretrizes foram escritas para a UE. Outros países têm suas próprias regras. Verifique as do seu.

Passos práticos:

- Decida a finalidade primeiro. Observar uma caixa d'água é uma finalidade diferente de gravar pessoas em um portão.
- Aponte as câmeras para o que você precisa ver, não para casas ou caminhos usados por pessoas.
- Limite quem pode ver as gravações. Informe às pessoas que as câmeras estão em uso.

## Monitoramento Humano de Territórios

Câmeras e rádio ajudam apenas quando uma pessoa verifica os dados. Estabeleça uma escala de leituras e uma regra de alerta. Faça testes antes de uma emergência.

## Perguntas Abertas

- A regra de licenciamento para transmitir no seu país e na frequência escolhida. Não verificada aqui. (inferido que a maioria dos países exige licença para a maioria das transmissões)
- Limites de potência e tempo no ar para LoRa na sua região. Não verificados aqui.
- Escolhas de hardware para nós LoRa e seus custos. Não recomendados aqui.
- Regras locais sobre CCTV e consentimento fora da UE. Não verificadas.
- Se uma comunidade local pode usar câmeras compartilhadas sem consentimento de todas as pessoas na imagem. Consulte um advogado local. (inferido)

## Fontes

Obtido em 2026-10-30.

- https://www.rtl-sdr.com/about-rtl-sdr/ (dongle é somente de recepção, cerca de US$ 30, notas sobre faixa de frequência)
- https://github.com/osmocom/rtl-sdr (descrição do software RTL-SDR, licença GPL-2.0)
- https://www.itu.int/pub/R-REG-RR (Regulamento de Radiocomunicações da UIT, o tratado internacional para o espectro de rádio)
- https://lora-alliance.org/about-lorawan/ (LoRa e LoRaWAN, faixas não licenciadas)
- https://meshtastic.org/docs/ (visão geral do Meshtastic, sem necessidade de telefone para mensagens em malha)
- https://meshtastic.org/docs/overview/ (tamanho da carga útil, limite de saltos, conexão do cliente, MQTT é opcional)
- https://meshtastic.org/docs/overview/encryption/ (chave do canal padrão é pública; canais privados expõem metadados de pacotes)
- https://meshtastic.org/docs/configuration/device-uis/meshtasticui/ (interface de tela no dispositivo em alguns aparelhos)
- https://github.com/meshtastic/firmware (licença GPL-3.0)
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf (avisos de alerta, informações de primeira camada, limites de armazenamento)