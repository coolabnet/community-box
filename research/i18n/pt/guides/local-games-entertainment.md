---
title: Jogos e Entretenimento Locais
sourcePath: guides/local-games-entertainment.md
sourceHash: f2220f697a32cb3a
translatedBy: glm-4.6
---

# Jogos e Entretenimento Hospedados Localmente

Muitas redes comunitárias têm pouca ou nenhuma internet. Os membros ainda querem coisas para fazer em seus dispositivos e na rede local. Este guia define entretenimento hospedado localmente e com capacidade para funcionar offline. Ele apresenta critérios para escolhê-lo e lista alguns exemplos que foram verificados nos sites oficiais.

Este é um guia, não uma entrada de catálogo.

**Uma observação sobre jogos de azar.** O feedback dos parceiros por trás deste guia levantou o jogo de azar online como uma preocupação. Este guia não afirma que jogos locais reduzem jogos de azar. Nenhuma evidência sobre essa questão foi avaliada. Qualquer decisão sobre risco de jogos de azar precisa de sua própria revisão.

## O Que Conta Como Entretenimento Local

Para este guia, o entretenimento local tem três características:

1. **Ele roda no hardware ou nos dispositivos da própria comunidade.** O servidor ou o computador de um membro o hospeda. Os membros o acessam pela rede local.
2. **Ele funciona offline após a configuração.** Instalar o software ou o conteúdo pode precisar de internet uma vez. Usá-lo não deveria.
3. **Ele é utilizável legalmente.** A licença permite que a comunidade o instale e o compartilhe.

Qualquer coisa que precise de um serviço de internet ativo para jogar não passa no teste offline.

## Critérios de Seleção

Use estas perguntas antes de adicionar qualquer coisa:

- **Licença:** O código ou o conteúdo está sob uma licença livre ou aberta? Leia o arquivo de licença. Não confie em um resumo.
- **Uso offline:** Ele funciona sem internet após a configuração? Teste-o com o roteador desconectado.
- **Recursos:** Ele rodará no hardware que você tem? Teste no dispositivo mais fraco que você planeja usar.
- **Idiomas:** A interface, ou o conteúdo, está em um idioma que os membros leem?
- **Adequação de idade:** Verifique a classificação ou as notas de conteúdo. Grupos com idades mistas precisam de cuidado extra.
- **Manutenção:** O projeto ainda é atualizado? Quem aplicará as atualizações?

## Exemplos de Candidatos

Cada exemplo abaixo foi verificado em seu site ou repositório oficial. Nenhum foi testado em hardware comunitário.

**1. Luanti (um motor de jogos voxel).** Luanti descreve-se como um [motor de jogos voxel de código aberto](https://luanti.org/en/). Ele está disponível para Windows, macOS, GNU/Linux, BSDs e Android. Seu site diz que você pode jogar [sozinho, localmente com amigos, ou online em um servidor](https://luanti.org/en/). O repositório do projeto inclui instruções para [executar um servidor com Docker](https://github.com/luanti-org/luanti). Um servidor local poderia permitir que os membros jogassem juntos na LAN. Verifique o arquivo de licença antes de usar.

**2. Jellyfin (servidor de mídia local).** O Jellyfin descreve-se como um [software livre](https://jellyfin.org/) que permite coletar, gerenciar e transmitir sua mídia de um servidor que você administra. Uma comunidade poderia hospedar filmes, músicas e outras mídias às quais tem direitos. Verifique os direitos do conteúdo e as necessidades de recursos do servidor antes de planejar.

**3. Kiwix (biblioteca de leitura offline).** O repositório das ferramentas Kiwix descreve [kiwix-serve e kiwix-manage](https://github.com/Kiwix/kiwix-tools) como ferramentas de linha de comando do Kiwix. Seus tópicos incluem "offline" e "zim". O Kiwix é material de leitura, não um jogo. Inclua-o apenas se a comunidade considerar a leitura offline como entretenimento. O site do projeto também oferece [dispositivos hotspot](https://kiwix.org/).

Mais dois tipos de candidatos foram considerados, mas não verificados aqui:

- Coleções de jogos HTML5 abertos com licenças claras. Nenhuma fonte foi verificada para este guia.
- Outros motores de jogos clássicos ou retrô. Nenhuma fonte foi verificada.

## O Que Não Está Coberto

- Dimensionamento de hardware para cada exemplo.
- Licenças para cada jogo ou item de mídia. Verifique cada um.
- Se essas ferramentas reduzem algum comportamento nocivo. Este guia não avalia isso.
- Instalação passo a passo. Siga a documentação oficial de cada ferramenta.

## Questões em Aberto

- (inferido) O servidor do Luanti precisa de mais memória do que um servidor local básico. Não medido.
- (inferido) A transcodificação do Jellyfin pode tornar um servidor de baixo consumo lento. Não testado aqui.
- As licenças do conteúdo de Luanti, Jellyfin e Kiwix não foram verificadas. Leia o arquivo de licença de cada projeto antes de usar.
- Quais coleções de jogos HTML5 abertos têm licenças claras. Não pesquisado.
- Se os membros da comunidade desejam jogos locais. Isso precisa de uma decisão da comunidade, não uma técnica.

## Fontes

Obtidas em 2026-10-30.

- https://luanti.org/en/ (descrição do motor, plataformas, modos de jogo incluindo servidor)
- https://github.com/luanti-org/luanti (descrição do motor; link para documentação de servidor com Docker)
- https://jellyfin.org/ (descrição do servidor de mídia software livre)
- https://github.com/Kiwix/kiwix-tools (ferramentas de linha de comando kiwix-serve e kiwix-manage)
- https://kiwix.org/ (página inicial do projeto Kiwix; produtos hotspot)