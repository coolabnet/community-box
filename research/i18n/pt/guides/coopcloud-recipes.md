---
title: Receitas do Co-op Cloud
sourcePath: guides/coopcloud-recipes.md
sourceHash: 3bdcdf44fdb72aa7
translatedBy: glm-4.6
---

# Co-op Cloud e Recipes: Quando Eles Servem para uma Community Box

O Co-op Cloud é um grupo de projetos de software. Ele se descreve como um [software commons e federação internacional](https://coopcloud.tech/) que constrói tecnologia democrática. Sua ferramenta principal para executar aplicativos é o `abra`, um programa de linha de comando. Os aplicativos são implantados a partir de arquivos chamados recipes.

Este guia explica os termos, a maturidade do projeto e quando o Co-op Cloud serve para uma Community Box. É um guia, não uma entrada de catálogo.

Nota: um participante do Global Gathering 2026 recomendou o Co-op Cloud. Este guia registra esse feedback. Não é uma evidência de que a ferramenta funcione bem para qualquer comunidade.

## O Que é o Co-op Cloud

O Co-op Cloud fornece:

- **abra:** o cliente de linha de comando. O projeto o chama de [cliente principal e ferramenta de linha de comando](https://git.coopcloud.tech/toolshed/abra) do Co-op Cloud. Ele é escrito em Go e é software livre. Seu [arquivo LICENSE](https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE) é a GNU General Public License v3.
- **Recipes:** os arquivos de configuração que o `abra` usa para implantar aplicativos.
- **Docs:** guias para operadores e mantenedores em [docs.coopcloud.tech](https://docs.coopcloud.tech/).

A documentação descreve os operadores como pessoas que executam uma implantação do Co-op Cloud. Os operadores são frequentemente [indivíduos ou membros de cooperativas ou coletivos de tecnologia](https://docs.coopcloud.tech/operators/).

## O Que é um Recipe

O projeto define um recipe como [o arquivo de configuração usado para implantar aplicativos com a CLI abra](https://docs.coopcloud.tech/abra/recipes/). Um catálogo web lista os recipes existentes. Você pesquisa um aplicativo lá e depois o implanta com o `abra`.

Os recipes têm uma pontuação de qualidade. A página de recipes lista quatro níveis:

- 0: nenhum,
- 1: implantação básica, com secrets e redes configurados manualmente,
- 2: secrets e redes automáticos,
- 3: o mesmo que 2, mais um health check.

Uma pontuação mais alta significa menos trabalho manual. Verifique a pontuação antes de implantar um aplicativo.

## Aviso de Maturidade

A documentação diz que o projeto é [software ainda em qualidade beta](https://docs.coopcloud.tech/). A página adverte os usuários a considerarem isso antes de executá-lo em produção. A versão do abra mostrada no repositório é 0.13.0-beta.

Para uma rede comunitária, isso significa que uma implantação do Co-op Cloud precisa de um operador que consiga ler erros, atualizar software e corrigir problemas sem ajuda externa.

## Quando Serve para uma Community Box

O Co-op Cloud pode servir quando todas estas condições forem verdadeiras:

- O servidor é uma máquina x86 com memória e armazenamento suficientes, e está conectada à internet.
- Pelo menos um mantenedor se sente confortável com a linha de comando.
- A comunidade quer aplicativos que o catálogo do Co-op Cloud já empacota.
- A comunidade aceita que o software está em beta.

É uma escolha inadequada quando o servidor precisa executar offline, quando ninguém quer usar um terminal, ou quando a equipe não consegue testar atualizações.

## Opções Mais Simples neste Repositório

Este repositório já documenta plataformas mais simples. Leia primeiro estas notas de projeto:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

Este guia não verificou novamente essas plataformas. Use as notas do repositório sobre elas.

Escolha o Co-op Cloud apenas quando a comunidade tiver uma necessidade clara que as plataformas mais simples não atendam.

## Questões em Aberto

- (inferido) Os aplicativos do Co-op Cloud rodam no Docker Swarm. O briefing deste guia diz isso, mas as páginas consultadas para este guia não confirmaram. Verifique a [documentação do abra](https://docs.coopcloud.tech/abra/) antes de depender disso.
- (inferido) Uma implantação precisa de acesso à internet para baixar imagens de containers. Não confirmado nas páginas consultadas.
- A licença dos recipes individuais não foi verificada. Verifique cada recipe antes de reutilizá-lo.
- A página de documentação do abra em docs.coopcloud.tech/abra/ não foi consultada para este guia.

## Fontes

Consultadas em 2026-10-30.

- https://coopcloud.tech/ (descrição do projeto: software commons, federação, ferramentas)
- https://docs.coopcloud.tech/ (aviso de qualidade beta, lista de guias)
- https://docs.coopcloud.tech/operators/ (quem são os operadores)
- https://docs.coopcloud.tech/abra/recipes/ (definição de recipe, catálogo, níveis de pontuação de CI)
- https://git.coopcloud.tech/toolshed/abra (descrição do abra: CLI principal, Go, software livre, versão 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)