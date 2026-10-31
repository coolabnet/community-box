---
title: Receitas Co-op Cloud
sourcePath: guides/coopcloud-recipes.md
sourceHash: 5ce3bb546f64fd2e
translatedBy: glm-4.6
---

# Co-op Cloud e Recipes: Quando Eles Servem para uma Community Box

Co-op Cloud é um grupo de projetos de software. Ele se descreve como um [software commons e federação internacional](https://coopcloud.tech/) que constrói tecnologia democrática. Sua principal ferramenta para executar aplicativos é `abra`, um programa de linha de comando. Os aplicativos são implantados a partir de arquivos chamados recipes.

Este guia explica os termos, o nível de maturidade do projeto e quando o Co-op Cloud serve para uma Community Box. É um guia, não uma entrada de catálogo.

Nota: uma participante do Global Gathering 2026 recomendou o Co-op Cloud. Este guia registra esse feedback. Isso não é evidência de que a ferramenta funcione bem para qualquer comunidade.

## O que é o Co-op Cloud

O Co-op Cloud fornece:

- **abra:** o cliente de linha de comando. O projeto o chama de [cliente principal e ferramenta de linha de comando](https://git.coopcloud.tech/toolshed/abra) do Co-op Cloud. É escrito em Go e é software livre. Seu [arquivo LICENSE](https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE) é a GNU General Public License v3.
- **Recipes:** os arquivos de configuração que `abra` usa para implantar aplicativos.
- **Docs:** guias para operadores e mantenedores em [docs.coopcloud.tech](https://docs.coopcloud.tech/).

A documentação descreve os operadores como pessoas que administram uma implantação do Co-op Cloud. Os operadores são frequentemente [indivíduos ou membros de cooperativas de tecnologia ou coletivos](https://docs.coopcloud.tech/operators/).

## O que é um Recipe

O projeto define um recipe como [o arquivo de configuração usado para implantar aplicativos com a CLI abra](https://docs.coopcloud.tech/abra/recipes/). Um catálogo web lista os recipes existentes. Você procura um aplicativo lá e depois o implanta com `abra`.

A página de recipes usa duas escalas diferentes. Leia ambas.

**Pontuação de CI (0 a 3).** Esta escala mede a automação na integração contínua de um recipe:

- 0: nenhuma.
- 1: implantação básica, com segredos e redes configurados manualmente.
- 2: segredos e redes automáticos.
- 3: o mesmo que 2, mais um health check.

**Status geral (1 a 5).** Esta é uma escala separada para o recipe como um todo:

- 5: tudo no nível 4, mais single sign-on.
- 4: imagem upstream, backups, e-mail, health check e testes de integração.
- 3: imagem upstream, com um ou dois itens do nível 4 ausentes.
- 2: três ou quatro itens do nível 4 ausentes, ou sem imagem upstream.
- 1: alfa.

As duas escalas medem coisas diferentes. Verifique ambas antes de implantar um aplicativo.

## Aviso de Maturidade

A [página inicial da documentação](https://docs.coopcloud.tech/) diz que o projeto ainda é software em qualidade beta. Ela pede que os usuários considerem isso antes de usá-lo em produção. A versão do abra mostrada no repositório é 0.13.0-beta.

Para uma rede comunitária, isso significa que uma implantação do Co-op Cloud precisa de um operador que saiba ler erros, atualizar software e corrigir problemas sem ajuda externa.

## Hardware e Conectividade: Considerações Qualificadoras

Estas são condições a verificar, não requisitos universais.

**Implantação offline ou apenas local.** O [manual do operador](https://docs.coopcloud.tech/operators/handbook/) diz que você pode querer executar o Co-op Cloud diretamente em um dispositivo, para testar um recipe ou para executar aplicativos fora da nuvem. Ele alerta que nomes de host locais impedem o Traefik de obter certificados do Let's Encrypt. A solução sugerida é o modo staging, certificados wildcard e um certificado autoassinado. Espere configuração adicional. Teste antes de depender disso.

**Hardware ARM.** O manual cita um comentário da comunidade. Ele diz que ARM funciona apenas se as imagens que você usa suportarem ARM, e que o abra não funcionava em ARM na época daquele comentário. Use imagens multiarquitetura ou ARM quando possível. Verifique se o abra funciona na sua placa antes de planejar em torno dele.

**x86 e acesso à internet.** O manual não estabelece uma regra de que o servidor precisa ser x86 ou estar sempre online. Verifique a arquitetura e a conectividade de que seus recipes precisam, não uma regra geral.

## Opções Mais Simples neste Repositório

Este repositório já documenta plataformas mais simples. Leia estas notas de projeto primeiro:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

Este guia não reverificou essas plataformas. Use as notas do repositório sobre elas.

Escolha o Co-op Cloud quando a comunidade tiver uma necessidade clara que as plataformas mais simples não atendam, e quando pelo menos um mantenedor saiba trabalhar em um terminal e testar atualizações.

## Questões em Aberto

- (inferido) Os aplicativos do Co-op Cloud rodam no Docker Swarm. O briefing deste guia diz isso, mas as páginas consultadas para este guia não confirmaram. Verifique a [documentação do abra](https://docs.coopcloud.tech/abra/) antes de confiar nisso.
- (inferido) Uma implantação normal precisa de acesso à internet para baixar imagens de contêiner. Não confirmado nas páginas consultadas.
- A afirmação sobre ARM vem de um comentário da comunidade, não de uma matriz de suporte oficial. Verifique o suporte atual do abra e das imagens antes de comprar hardware.
- A licença dos recipes individuais não foi verificada. Verifique cada recipe antes de reutilizar.

## Fontes

Consultadas em 2026-10-30.

- https://coopcloud.tech/ (descrição do projeto: software commons, federação, ferramentas)
- https://docs.coopcloud.tech/ (aviso de qualidade beta, lista de guias)
- https://docs.coopcloud.tech/operators/ (quem são os operadores)
- https://docs.coopcloud.tech/operators/handbook/ (implantação offline, nomes de host locais e certificados, imagens ARM e abra)
- https://docs.coopcloud.tech/abra/recipes/ (definição de recipe, pontuação de CI de 0 a 3, status geral de 1 a 5)
- https://git.coopcloud.tech/toolshed/abra (descrição do abra: CLI principal, Go, software livre, versão 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)