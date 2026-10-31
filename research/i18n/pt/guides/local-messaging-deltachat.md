---
title: Mensagens locais com Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: 67fb831428321077
translatedBy: glm-4.6
---

# Mensagens locais com Delta Chat

Este guia explica o Delta Chat e sua rede de relays. Ele mostra o que a documentação oficial descreve para uso offline. Ele compara quatro opções para uma Community Box.

## O que é o Delta Chat

O [Delta Chat](https://delta.chat/en/) é um mensageiro livre e de código aberto. Ele funciona no Android, iOS e desktop. Obtenha os aplicativos em [get.delta.chat](https://get.delta.chat).

O Delta Chat usa padrões de e-mail da internet. As mensagens passam por relays chatmail, que são servidores de e-mail. O Delta Chat usa um subconjunto seguro do OpenPGP para criptografia de ponta a ponta. Os contatos trocam chaves por código QR ou link de convite, usando o Secure-Join ([FAQ](https://delta.chat/en/help)).

O Autocrypt configura a criptografia entre contatos e membros de grupos automaticamente ([FAQ](https://delta.chat/en/help)). O FAQ diz que o Autocrypt v2 está previsto para 2026. Este guia não verificou se ele já foi lançado.

## Relays Chatmail

Um relay mantém as mensagens enquanto um dispositivo está offline. Os relays não armazenam nomes de grupos, avatares ou detalhes de contatos ([FAQ](https://delta.chat/en/help)).

Por padrão, o aplicativo configura os relays para você ([FAQ](https://delta.chat/en/help)). A página [chatmail.at/relays](https://chatmail.at/relays) lista relays públicos. Ela cita o nine.testrun.org como o relay de onboarding padrão para muitos aplicativos chatmail.

Uma comunidade pode executar seu próprio relay. O [repositório do relay](https://github.com/chatmail/relay) contém as ferramentas de configuração. O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) lista estes requisitos:

- Um servidor Debian 12 com portas SMTP, submission, IMAPS e HTTPS acessíveis.
- 1 GB de RAM, uma CPU e cerca de 10 GB de armazenamento para alguns milhares de endereços.
- Controle de um domínio por meio de um provedor de DNS.
- Uma máquina de build com acesso por chave SSH ao usuário root do servidor.

A configuração precisa de um registro DNS A para o domínio. O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) incentiva o IPv6 quando disponível, por isso também mostra um registro AAAA. O registro AAAA é recomendado, não obrigatório. Domínios que começam com um sublinhado usam certificados autoassinados em vez de Let's Encrypt.

A documentação descreve um relay experimental somente IP. Ele não precisa de domínio e pode usar um endereço IPv4 em uma rede local. A [página somente IP](https://chatmail.at/doc/relay/iponly.html) declara três limitações:

- A opção é experimental e pode mudar sem aviso.
- A criptografia de transporte usa certificados autoassinados, que a página chama de vulneráveis a ataques man-in-the-middle.
- As mensagens não são assinadas com DKIM. Alguns relays podem rejeitá-las.

A documentação não diz se um relay funciona sem conexão com a internet. Este guia trata isso como desconhecido.

## Recursos locais e offline na documentação

A documentação oficial descreve estes recursos locais:

- **Transferência para segundo dispositivo.** Ambos os dispositivos devem estar na mesma rede Wi-Fi ou rede. Um código QR inicia a transferência ([FAQ](https://delta.chat/en/help)).
- **Fallback de hotspot móvel.** Se os dispositivos não conseguirem se ver, o FAQ sugere um hotspot de celular.
- **Contato presencial.** Um código QR adiciona um membro pessoalmente ([FAQ](https://delta.chat/en/help)).
- **Aplicativos no chat.** Os aplicativos Webxdc são arquivos zip que rodam dentro dos chats ([webxdc FAQ](https://delta.chat/en/help)).

A documentação não descreve um modo de chat somente LAN. A documentação não diz que o chat funciona sem um relay. A documentação oficial não confirma chat offline entre dois aplicativos Delta Chat. O ButterBox descreve uma configuração offline em seu próprio blog, abordado abaixo.

## Opções para uma Community Box

| Opção | Precisa de internet? | Precisa de domínio? | Esforço |
|---|---|---|---|
| (a) Relays chatmail públicos | Sim | Não | Baixo: instalar o aplicativo e escolher um relay |
| (b) Auto-hospedar um relay chatmail | Sim para uso público. Uso somente LAN não está documentado | Sim para a configuração padrão. A opção somente IP é experimental | Alto: servidor Debian 12, DNS, SSH, ferramentas de deploy |
| (c) ButterBox em um Raspberry Pi, apenas chat | Não | Não | Médio: montar ou obter a box |
| (d) Delta Chat por meio de um ButterBox | Não | Não | Médio: mesma box que (c), mais a configuração do Delta Chat |

A opção (a) se encaixa em um local com acesso à internet. A opção (b) se encaixa em um local que pode hospedar um servidor com DNS público. A opção (b) inclui o relay experimental somente IP. Esse relay é separado da opção (d). A opção (d) usa um relay que roda na própria box.

O ButterBox é a opção offline desta análise. Ele transmite sua própria rede Wi-Fi. O [Butter Box](https://likebutter.app/) diz que funciona sem internet. Os usuários entram em um chatroom público ou criam um privado. O site lista chat criptografado como um recurso. Ele diz que tudo é armazenado na box. A [documentação](https://likebutter.app/docs) descreve a box como um hotspot com conteúdo local.

A opção (d) é a configuração offline concreta do Delta Chat. A [página Secure Messenger](https://likebutter.app/docs/services/secure-messenger) diz que as pessoas na mesma Butter Box podem enviar mensagens umas às outras sem internet. A [postagem do ButterBox Delta Chat](https://likebutter.app/blog/butterbox-deltachat) diz que a box executa um servidor local MadMail, um servidor chatmail de código aberto. O aplicativo em cada dispositivo é configurado com esse servidor local. A postagem chama uma única ButterBox de hub de mensagens assíncronas. Ela diz que o aplicativo Android e o MadMail vêm no firmware básico. Ela mostra um cliente Linux desktop funcionando, mas diz que empacotar o aplicativo desktop e o suporte à web local são planos futuros. Os testes iniciais são descritos como promissores. Trate isso como uma configuração de box única que ainda não está completa. Este guia não a testou.

O feedback da comunidade da GG2026 diz que o Delta Chat e o ButterBox funcionaram em uma rede local. Isso não está verificado, então nenhuma opção é recomendada a partir disso. O mesmo feedback diz que o AIR e o DashChat planejam suporte a servidor local e carecem de financiamento comprometido ou de um roadmap. Isso também não está verificado. O [relatório da FIFAfrica 2026](https://likebutter.app/blog/fifafrica-2026) descreve uma demonstração offline do DashChat. O DashChat rodou offline com uma Butter Box como seu servidor, e seu hub de mensagens local foi adicionado à Butter Box. O relatório não menciona o AIR. Nem o AIR nem o DashChat são recomendados ainda.
## Notas de Privacidade

Os servidores do Delta Chat veem os endereços do remetente e do destinatário e o tamanho das mensagens ([FAQ](https://delta.chat/en/help)). Os endereços são aleatórios por padrão. Outros dados de contatos e grupos viajam criptografados de ponta a ponta dentro das mensagens e são mantidos nos dispositivos. Os relays também veem o endereço IP de cada usuário, pois precisam dele para entregar as mensagens ([FAQ](https://delta.chat/en/help)).

Para usos sensíveis, crie um perfil separado com um endereço aleatório. O FAQ recomenda isso para limitar a coleta de metadados. Um perfil separado não protege, por si só, os dados em um telefone ou computador que seja confiscado. Ative também a criptografia de disco do próprio dispositivo e o bloqueio de tela. Uma [nota de desenvolvedor do Delta Chat](https://support.delta.chat/t/researching-a-zero-trust-storage-layer-for-deltachat-core-rust-thoughts/4554/6) recomenda confiar na criptografia do sistema operacional para os dados armazenados.

Os operadores de relay mantêm seus próprios servidores. Relays públicos são operados por diferentes grupos e pessoas ([página de relays](https://chatmail.at/relays)). A documentação do relay descreve como objetivo não coletar dados privados nem metadados ([repositório do relay](https://github.com/chatmail/relay)). Esse é um objetivo de design, não um resultado de auditoria.

A documentação não lista o horário das mensagens como visível para os relays. Os relays provavelmente veem quando as mensagens chegam (inferido).

**Aviso: altere as credenciais padrão do ButterBox antes de implantá-lo.** O aparelho vem com credenciais padrão documentadas para três contas: o usuário do sistema operacional, o administrador do ponto de acesso e o administrador do chat. A rede Wi-Fi é aberta por padrão, sem senha. Qualquer pessoa por perto pode se conectar à rede. Qualquer pessoa que conheça o padrão do administrador do chat pode assumir a administração do chat. Altere as três credenciais e adicione uma senha Wi-Fi antes que o aparelho atenda usuários. O [guia de segurança do ButterBox](https://likebutter.app/docs/security) lista os passos. O [início rápido](https://likebutter.app/docs/quick-start) diz que a rede Wi-Fi é aberta por padrão e mostra como adicionar uma senha Wi-Fi nas Admin Settings.

## Questões em Aberto

- Qual configuração local o Delta Chat usou na GG2026 não está confirmado. A configuração do Delta Chat do ButterBox é uma candidata provável (inferido).
- Se um relay auto-hospedado ou somente-IP funciona sem conexão com a internet é desconhecido. A documentação não menciona.
- Se o Autocrypt v2 já foi lançado é desconhecido.
- Os detalhes da criptografia de chat do ButterBox são desconhecidos. As fontes consultadas não os descrevem.