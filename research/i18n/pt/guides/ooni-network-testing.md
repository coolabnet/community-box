---
title: Teste de Rede OONI
sourcePath: guides/ooni-network-testing.md
sourceHash: 26836f71d381300b
translatedBy: glm-4.6
---

# OONI Probe: Testando se Sites Estão Bloqueados

OONI Probe é uma ferramenta gratuita. Ela verifica se sites e aplicativos estão bloqueados em uma rede. Ela roda no telefone ou computador de um membro. Não é um serviço de servidor. Este guia recomenda dispositivos pessoais como escolha de implantação. A ferramenta de linha de comando do OONI também pode rodar no Linux e Raspberry Pi, mas este guia não recomenda instalá-la em uma Community Box ou em qualquer servidor compartilhado.

## O que o OONI Probe Faz

O OONI Probe executa testes a partir do dispositivo onde está instalado. Ele pode testar se um site ou aplicativo está bloqueado. Ele também pode medir a velocidade e o desempenho da rede. A [página inicial do OONI](https://ooni.org/) o descreve como uma ferramenta para testar o bloqueio de sites e aplicativos.

O OONI Probe está disponível nestas formas:

- **Celular:** Android e iOS. O aplicativo está no Google Play, na App Store e no F-Droid ([página de instalação](https://ooni.org/install)).
- **Desktop:** Windows e macOS ([página de instalação](https://ooni.org/install)).
- **Linha de comando:** Linux e macOS na página de instalação. O [guia da CLI](https://ooni.org/support/ooni-probe-cli) lista macOS, Debian/Ubuntu e Raspberry Pi como plataformas suportadas.

## O que É Publicado

A [política de dados do OONI](https://ooni.org/about/data-policy/) descreve o que é coletado por padrão, a menos que você desative o envio de medições:

- a data e hora de cada medição, que não podem ser desativadas,
- um código de país, derivado do seu endereço IP, que não pode ser desativado,
- sua rede (ASN) e tipo de rede, como Wi-Fi ou dados móveis, que não podem ser desativados,
- o sistema operacional (aplicativos) ou o nome do navegador,
- as medições dos testes que você executa.

A política diz que o OONI não tem como objetivo armazenar endereços IP e os remove onde pode. Ela também diz que o probe pode enviar dados que contêm informações de identificação, como endereços IP ou cabeçalhos HTTP.

O [OONI Explorer](https://explorer.ooni.org/) publica esses dados abertos. A [página de riscos](https://ooni.org/about/risks/) diz que as medições são publicadas por padrão e que você pode desativar isso nas configurações do aplicativo.

**Os testes de desempenho são diferentes.** A política de dados diz que, se você executar os testes de desempenho, a M-Lab coleta e publica seu endereço IP independentemente das configurações do seu OONI Probe. Desativar o envio de dados no OONI não impede isso. Não execute testes de desempenho a menos que aceite que seu endereço IP será publicado.

## Testes Automatizados em Instalações Linux

O [guia da CLI](https://ooni.org/support/ooni-probe-cli) diz que, no Debian/Ubuntu e Raspberry Pi, testes automatizados são executados por padrão após a instalação. Essas execuções automatizadas rodam como o usuário `ooniprobe`, não como o seu usuário de login.

Para revisar os resultados dessas execuções automatizadas, o guia usa a configuração `OONI_HOME`. Por exemplo:

- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe list`
- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe show <measurement-id>`

O guia documenta os comandos `ooniprobe autorun` (comandos de start, stop, status e log), mas diz que eles funcionam apenas no macOS. Ele não documenta como desativar os testes automatizados no Debian/Ubuntu ou Raspberry Pi. A chave de configuração `sharing.upload_results` controla os envios, não o agendamento.

Por esse motivo, não instale a CLI no Debian/Ubuntu ou Raspberry Pi, a menos que tenha uma maneira testada de interromper as execuções automatizadas. Consulte a documentação atual do OONI ou pergunte ao projeto antes de instalá-la lá.

## Riscos Legais e de Segurança

A própria [página de riscos](https://ooni.org/about/risks/) do OONI é a principal fonte para esta seção. Leia-a por completo antes de instalar o aplicativo.

- O risco legal varia por país. O OONI aconselha os membros a consultar um advogado licenciado em seu país antes de instalar ou executar o OONI Probe.
- Em alguns países, a medição ativa da rede pode ser ilegal. A página diz que pode ser tratada como uma forma de espionagem.
- Qualquer pessoa que observe seu tráfego de internet, como um provedor de internet (ISP), um governo ou um empregador, pode ver que você executa o OONI Probe.
- O teste Web Connectivity entra em contato com uma ampla variedade de sites. Alguns podem ser questionáveis ou ilegais em alguns países.
- O OONI diz que os usuários executam o software por sua conta e risco.

Este guia não fornece aconselhamento jurídico. Cada membro deve decidir por si mesmo, com um advogado local, se possível. A comunidade não deve pressionar os membros a executar os testes.

## Adequação a uma Rede Comunitária

O OONI Probe se adequa como um aplicativo complementar nos dispositivos dos próprios membros. A comunidade não precisa hospedar nada. Os testes entram em contato com sites, portanto um dispositivo precisa de conexão enquanto um teste é executado. Em uma rede sem internet, os testes não conseguem alcançar os sites que verificam. Uma comunidade com internet fraca ou inexistente não deve planejar execuções regulares do OONI.

## Questões em Aberto

- (inferido) A CLI pode armazenar resultados até que uma conexão volte. O guia da CLI consultado não confirmou isso.
- (inferido) Telefones mais antigos podem não executar bem o aplicativo móvel. Não testado nem verificado aqui.
- A licença de software do OONI está vinculada na página de riscos como [github.com/ooni/license](https://github.com/ooni/license). O texto não foi verificado para este guia.
- O guia não documenta como desativar os testes automatizados da CLI no Debian/Ubuntu ou Raspberry Pi. Verifique com o OONI antes de confiar em qualquer método.

## Fontes

Consultadas em 2026-10-30.

- https://ooni.org/ (página inicial do OONI: o que o projeto e o aplicativo fazem)
- https://ooni.org/install (plataformas: Android, iOS, Windows, macOS, Linux e CLI para macOS)
- https://ooni.org/support/ooni-probe-cli (plataformas da CLI, testes automatizados por padrão no Debian/Ubuntu e Raspberry Pi, comandos de revisão do OONI_HOME, autorun apenas no macOS, sharing.upload_results)
- https://ooni.org/about/data-policy/ (campos coletados por padrão, publicação de IP pela M-Lab para testes de desempenho)
- https://ooni.org/about/risks/ (publicação por padrão, opt-out, riscos legais e de segurança, link da licença de software)
- https://explorer.ooni.org/ (OONI Explorer: dados abertos)