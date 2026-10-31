---
title: Teste de Rede OONI
sourcePath: guides/ooni-network-testing.md
sourceHash: 97a3d8f9da2d1626
translatedBy: glm-4.6
---

# OONI Probe: Testando Se Sites Estão Bloqueados

O OONI Probe é um aplicativo gratuito. Ele verifica se sites e aplicativos estão bloqueados em uma rede. Um membro o executa em seu próprio celular ou computador. Não é um servidor, e não roda na Community Box.

Este guia explica o que o OONI Probe faz, para onde vão seus resultados e quais riscos um membro deve considerar antes de executá-lo.

## O que o OONI Probe Faz

O OONI Probe executa testes a partir do dispositivo onde está instalado. Ele pode testar se um site ou aplicativo está bloqueado. Ele também pode medir a velocidade e o desempenho da rede. O projeto OONI o descreve como uma forma de [testar o bloqueio de sites e aplicativos](https://ooni.org/).

O OONI Probe está disponível nestas formas:

- **Celular:** Android e iOS. O aplicativo está no Google Play, na App Store e no F-Droid ([página de instalação](https://ooni.org/install)).
- **Desktop:** Windows e macOS ([página de instalação](https://ooni.org/install)).
- **Linha de comando:** Linux e macOS ([página de instalação](https://ooni.org/install), com instruções em [ooni.org/install/cli](https://ooni.org/install/cli)).

Cada forma tem seu próprio guia de usuário no site de suporte do OONI.

## Para Onde Vão os Resultados

O OONI publica os resultados dos testes. O site OONI Explorer mostra os dados como [dados abertos sobre censura na internet](https://explorer.ooni.org/). A página do Explorer diz que os dados foram coletados pela comunidade global do OONI, e pede aos usuários que instalem o OONI Probe e executem testes para contribuir com ele.

Por padrão, o OONI envia cada medição ao seu coletor. O coletor a publica no OONI Explorer e por meio da API do OONI. O usuário pode desativar isso nas configurações do aplicativo ([página de riscos do OONI](https://ooni.org/about/risks/)).

A página de riscos do OONI diz que os dados publicados incluem:

- sua localização aproximada,
- a rede (ASN) da qual você se conecta,
- o horário em que você executou o teste.

O OONI diz que não coleta deliberadamente seu endereço IP. A página também diz que um endereço IP ainda pode aparecer em cabeçalhos HTTP ou outros metadados.

## Riscos Legais e de Segurança

A própria página de riscos do OONI é a fonte principal desta seção. Leia-a por completo antes de instalar o aplicativo.

Pontos principais dessa página:

- O risco legal varia por país. O OONI aconselha os membros a [consultar um advogado licenciado em seu país](https://ooni.org/about/risks/) antes de instalar ou executar o OONI Probe.
- Em alguns países, a medição ativa da rede pode ser ilegal. A página diz que pode ser tratada como uma forma de espionagem.
- Qualquer pessoa que observe seu tráfego de internet, como um provedor, um governo ou um empregador, pode ver que você executa o OONI Probe.
- O teste Web Connectivity entra em contato com uma ampla variedade de sites. Alguns podem ser objetáveis ou ilegais em alguns países.
- O OONI afirma que os usuários executam o software por sua conta e risco.

Este guia não fornece aconselhamento jurídico. Cada membro deve decidir por si mesmo, se possível com um advogado local. A comunidade não deve pressionar membros a executar os testes.

## Adequação a uma Rede Comunitária

O OONI Probe funciona como um aplicativo complementar. Os membros o instalam em seus próprios dispositivos. A comunidade não precisa hospedar nada.

Necessidades de rede:

- Os testes entram em contato com sites, então o dispositivo precisa de conexão enquanto o teste é executado.
- Os resultados são enviados ao OONI. A página de riscos descreve esse envio como o caminho padrão.
- Em uma rede sem internet, os testes não conseguem alcançar os sites que verificam. Um membro ainda pode instalar o aplicativo com antecedência.

Uma rede comunitária com internet fraca ou inexistente não deve planejar execuções regulares do OONI. Um membro com uma conexão utilizável pode executar testes em nome da comunidade, mas somente se aceitar os riscos descritos acima.

## Questões em Aberto

- (inferido) A CLI pode armazenar os resultados até que uma conexão retorne. Os documentos consultados para este guia não confirmaram isso. Verifique o [guia de usuário da CLI](https://ooni.org/support/ooni-probe-cli) antes de confiar nisso.
- (inferido) Celulares mais antigos podem não executar bem o aplicativo móvel. Não testado nem verificado aqui.
- A licença do software OONI Probe está vinculada na página de riscos como [github.com/ooni/license](https://github.com/ooni/license). O texto não foi verificado para este guia.

## Fontes

Consultadas em 2026-10-30.

- https://ooni.org/ (página inicial do OONI: o que o projeto e o aplicativo fazem)
- https://ooni.org/install (plataformas: Android, iOS, Windows, macOS, CLI Linux)
- https://ooni.org/install/cli (vinculada a partir da página de instalação; não consultada diretamente)
- https://ooni.org/support/ooni-probe-cli (vinculada a partir da página de instalação; não consultada diretamente)
- https://ooni.org/about/risks/ (publicação por padrão, campos publicados, riscos legais e de segurança, link da licença do software)
- https://explorer.ooni.org/ (OONI Explorer: dados abertos, contribuição por meio da execução de testes)