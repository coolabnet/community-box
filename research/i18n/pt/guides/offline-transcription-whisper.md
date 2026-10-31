---
title: Transcrição Offline com Whisper
sourcePath: guides/offline-transcription-whisper.md
sourceHash: 31f81f379a28b51e
translatedBy: glm-4.6
---

# Reconhecimento de Fala para Texto Offline com Whisper: Nota de Viabilidade

> **Nota de viabilidade.** Esta nota testa se a transcrição offline é possível em hardware comunitário. Ela não recomenda uma configuração. A decisão de escopo (Q17) ainda está pendente.

Reconhecimento de fala para texto transforma áudio falado em texto escrito. Algumas comunidades querem registrar reuniões locais, entrevistas ou notas de voz. Esta nota pergunta se isso pode ser executado offline, em hardware que uma rede comunitária possa custear.

## O Que É o Whisper

Whisper é um modelo de reconhecimento de fala da OpenAI. Seu código e os pesos do modelo são publicados sob a Licença MIT ([openai/whisper](https://github.com/openai/whisper)). A Licença MIT permite uso gratuito, incluindo uso comercial, mantendo uma cópia da licença.

whisper.cpp é um port em C e C++ do Whisper. Não tem dependências e roda na CPU. Sua licença também é MIT ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)). Sua lista de plataformas inclui Linux, Windows, macOS, Android, iOS, WebAssembly e Docker. Ele cita o Raspberry Pi como uma plataforma, com um link para uma discussão.

Ambos os projetos executam inferência no seu próprio dispositivo. A demonstração do whisper.cpp para iPhone é descrita como totalmente offline e no dispositivo ([whisper.cpp README](https://github.com/ggml-org/whisper.cpp)). Teste a alegação de funcionamento offline na sua própria configuração antes de depender dela.

## Tamanhos de Modelo e Memória

O Whisper vem em cinco tamanhos: tiny, base, small, medium e large. O README da OpenAI lista estas figuras ([openai/whisper](https://github.com/openai/whisper)):

| Modelo | Parâmetros | VRAM necessária (GPU) | Velocidade relativa |
|---|---|---|---|
| tiny | 39 M | cerca de 1 GB | cerca de 10x |
| base | 74 M | cerca de 1 GB | cerca de 7x |
| small | 244 M | cerca de 2 GB | cerca de 4x |
| medium | 769 M | cerca de 5 GB | cerca de 2x |
| large | 1550 M | cerca de 10 GB | 1x |

O README mediu a velocidade relativa transcrevendo fala em inglês em uma GPU A100. Esses números não se aplicam a uma placa de CPU pequena.

O README do whisper.cpp fornece figuras de disco e memória para uso em CPU ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)):

| Modelo | Disco | Memória |
|---|---|---|
| tiny | 75 MiB | cerca de 273 MB |
| base | 142 MiB | cerca de 388 MB |
| small | 466 MiB | cerca de 852 MB |
| medium | 1.5 GiB | cerca de 2.1 GB |
| large | 2.9 GiB | cerca de 3.9 GB |

A necessidade de memória cresce com o tamanho do modelo. Um dispositivo com 2 GB de RAM pode executar tiny ou base. Modelos maiores precisam de mais RAM para funcionar.

## Níveis de Hardware

Encontramos apenas um benchmark citado em uma placa pequena. É uma página de resultados do whisper.cpp, com tempos em milissegundos ([whisper.cpp issue 89](https://github.com/ggml-org/whisper.cpp/issues/89)). A página não informa a duração do clipe de áudio. A ferramenta bench do whisper.cpp cronometra apenas o encoder, com dados aleatórios, não uma transcrição completa de áudio real ([bench README](https://github.com/ggml-org/whisper.cpp/blob/master/examples/bench/README.md)). Trate todos os tempos abaixo como apenas relativos, e não os leia como tempo de transcrição completa.

- **Raspberry Pi 5:** nenhum benchmark foi encontrado para esta placa. A única linha de Pi é um Raspberry Pi 4. Seu tempo de encode foi de cerca de 13.8 segundos para tiny e cerca de 30.6 segundos para base. (inferido para o Pi 5: espere resultados pelo menos tão bons quanto os do Pi 4, mas teste)
- **ZimaBoard e Intel N-series:** nenhum benchmark foi encontrado para estas placas. A página não tem linhas de N-series. Teste antes de planejar usá-las.
- **NUC ou outras máquinas x86 com mais RAM:** a mesma página lista linhas x86. Um Ryzen 9 5950X executou tiny em cerca de 197 ms e large em cerca de 8.1 segundos. Mais RAM permite executar os modelos medium ou large. A velocidade ainda depende da CPU.

Níveis práticos, com base nas figuras acima:

1. **Placa pequena, 2 GB de RAM:** apenas tiny ou base. Espere resultados lentos. (inferido)
2. **Placa com 4 GB ou mais de RAM:** small pode caber. Meça a velocidade real. (inferido)
3. **Mini PC x86 com mais RAM:** medium pode ser viável. Meça primeiro. (inferido)

## Cobertura de Idiomas

O README diz que os modelos multilíngues (tiny, base, small, medium, large) podem lidar com fala em idiomas não ingleses. As versões somente em inglês (terminadas em .en) têm melhor desempenho para inglês, especialmente tiny.en e base.en ([openai/whisper](https://github.com/openai/whisper)). O modelo turbo não é treinado para tradução, então use um modelo multilíngue se você precisar de tradução.

Não verificamos quais idiomas o Whisper suporta bem. Línguas indígenas e locais frequentemente têm poucos dados de treinamento. A precisão pode ser baixa para elas. (inferido) Teste com falantes nativos antes de depender de qualquer transcrição.

## Benefício de Privacidade

Executar o modelo no seu próprio dispositivo mantém o áudio no seu dispositivo. Nada precisa sair da rede local. Esta é a principal razão para executá-lo offline. (inferido do design da inferência local)

Verifique outros riscos. As transcrições ainda podem revelar fatos sensíveis. Armazene-as sob as mesmas regras que outros registros comunitários.

## Questões em Aberto

- Velocidade real no Raspberry Pi 5 com os modelos tiny, base e small. Não encontrado.
- Duração do clipe por trás da tabela de tempos do whisper.cpp. Não informada.
- Precisão para idiomas indígenas ou locais específicos. Não testada.
- Se a decisão de escopo (Q17) pede transcrição ao vivo ou transcrição de arquivo. Pendente.
- Consumo de energia e calor em placas pequenas durante trabalhos longos. Não verificado.

## Fontes

Coletadas em 2026-10-30.

- https://github.com/openai/whisper (licença MIT, tamanhos de modelo e tabela de VRAM, notas sobre multilíngue e .en, nota sobre tradução do turbo)
- https://github.com/ggml-org/whisper.cpp (licença MIT, port em C/C++, somente CPU, lista de plataformas, demonstração descrita como totalmente offline, tabela de memória em CPU)
- https://github.com/ggml-org/whisper.cpp/issues/89 (tabela de benchmark com linhas de Raspberry Pi 4 e x86, tempos em ms)