---
title: Mensagens locais com Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: 70ba75d340ff8212
translatedBy: glm-4.6
---

# Mensageria Local com Delta Chat

Este guia explica o Delta Chat e sua rede de relays. Ele mostra o que a documentação oficial descreve para uso offline. Ele compara três opções para uma Community Box.

## O que é o Delta Chat

O [Delta Chat](https://delta.chat/en/) é um mensageiro livre e de código aberto. Ele funciona em Android, iOS e desktop. Obtenha os aplicativos em [get.delta.chat](https://get.delta.chat).

O Delta Chat usa os padrões de e-mail da internet. As mensagens trafegam por chatmail relays, que são servidores de e-mail. O Delta Chat usa um subconjunto seguro do OpenPGP para criptografia de ponta a ponta. Os contatos trocam chaves por código QR ou link de convite, usando Secure-Join ([FAQ](https://delta.chat/en/help)).

O Autocrypt configura a criptografia entre contatos e membros de grupo automaticamente ([FAQ](https://delta.chat/en/help)). O FAQ diz que o Autocrypt v2 está previsto para 2026. Este guia não verificou se ele foi lançado.

## Chatmail Relays

Um relay mantém as mensagens enquanto um dispositivo está offline. Os relays não armazenam nomes de grupo, avatares ou detalhes de contato ([FAQ](https://delta.chat/en/help)).

Por padrão, o aplicativo configura os relays para você ([FAQ](https://delta.chat/en/help)). A página [chatmail.at/relays](https://chatmail.at/relays) lista relays públicos. Ela cita o nine.testrun.org como o relay de onboarding padrão para muitos aplicativos chatmail.

Uma comunidade pode executar seu próprio relay. O [repositório do relay](https://github.com/chatmail/relay) contém as ferramentas de configuração. O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) lista estes requisitos:

- Um servidor Debian 12 com portas SMTP, submission, IMAPS e HTTPS acessíveis.
- 1 GB de RAM, uma CPU e cerca de 10 GB de armazenamento para alguns milhares de endereços.
- Controle de um domínio por meio de um provedor de DNS.
- Uma máquina de build com acesso por chave SSH ao usuário root do servidor.

A configuração precisa de um registro DNS A para o domínio. O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) incentiva o IPv6 quando disponível, por isso também mostra um registro AAAA. O registro AAAA é recomendado, não obrigatório. Domínios que começam com underscore usam certificados autoassinados em vez de Let's Encrypt.

A documentação descreve um relay experimental somente-IP. Ele não precisa de domínio e pode usar um endereço IPv4 em uma rede local. A [página somente-IP](https://chatmail.at/doc/relay/iponly.html) indica três limitações:

- A opção é experimental e pode mudar sem aviso.
- A criptografia de transporte usa certificados autoassinados, que a página chama de vulneráveis a ataques man-in-the-middle.
- As mensagens não são assinadas com DKIM. Alguns relays podem rejeitá-las.

A documentação não diz se um relay funciona sem conexão com a internet. Este guia trata isso como desconhecido.

## Recursos Locais e Offline na Documentação

A documentação oficial descreve estes recursos locais:

- **Transferência para segundo dispositivo.** Ambos os dispositivos devem estar na mesma rede Wi-Fi ou rede. Um código QR inicia a transferência ([FAQ](https://delta.chat/en/help)).
- **Fallback por hotspot móvel.** Se os dispositivos não conseguirem se enxergar, o FAQ sugere um hotspot de celular.
- **Contato presencial.** Um código QR adiciona um membro pessoalmente ([FAQ](https://delta.chat/en/help)).
- **Aplicativos no chat.** Os aplicativos webxdc são arquivos zip que rodam dentro dos chats ([webxdc FAQ](https://delta.chat/en/help)).

A documentação não descreve um modo de chat somente-LAN. A documentação não diz que o chat funciona sem um relay. A documentação oficial não confirma chat offline entre dois aplicativos Delta Chat. A ButterBox descreve uma configuração offline em seu próprio blog, abordado abaixo.

## Opções para uma Community Box

| Opção | Precisa de internet? | Precisa de domínio? | Esforço |
|---|---|---|---|
| (a) Chatmail relays públicos | Sim | Não | Baixo: instalar o aplicativo e escolher um relay |
| (b) Auto-hospedar um chatmail relay | Sim para uso público. Uso somente-LAN não documentado | Sim para a configuração padrão. A opção somente-IP é experimental | Alto: servidor Debian 12, DNS, SSH, ferramentas de deploy |
| (c) ButterBox em um Raspberry Pi, apenas chat | Não | Não | Médio: construir ou obter a caixa |
| (d) Delta Chat por meio de uma ButterBox | Não | Não | Médio: mesma caixa que (c), mais a configuração do Delta Chat |

A opção (a) se adequa a um local com acesso à internet. A opção (b) se adequa a um local que possa hospedar um servidor com DNS público. A opção (b) inclui o relay experimental somente-IP. Esse relay é separado da opção (d). A opção (d) usa um relay que roda na própria caixa.

A ButterBox é a opção offline nesta análise. Ela transmite sua própria rede Wi-Fi. A [Butter Box](https://likebutter.app/) diz que funciona sem internet. Os usuários entram em um chatroom público ou criam um privado. O site lista chat criptografado como um recurso. Ele diz que tudo é armazenado na caixa. A [documentação](https://likebutter.app/docs) descreve a caixa como um hotspot com conteúdo local.

A opção (d) é a configuração offline concreta do Delta Chat. A [página Secure Messenger](https://likebutter.app/docs/services/secure-messenger) diz que pessoas na mesma Butter Box podem enviar mensagens umas às outras sem internet. A [postagem ButterBox Delta Chat](https://likebutter.app/blog/butterbox-deltachat) diz que a caixa roda um servidor MadMail local, um servidor chatmail de código aberto. O aplicativo em cada dispositivo é configurado com esse servidor local. A postagem chama uma única ButterBox de hub de mensageria assíncrona. Ela diz que o aplicativo Android e o MadMail vêm no firmware base. Ela também diz que o suporte a desktop e web local são planos futuros, e que os testes iniciais são promissores. Trate isso como uma configuração de caixa única que ainda não está completa. Este guia não a testou.

O feedback da comunidade da GG2026 diz que o Delta Chat e a ButterBox funcionaram em uma rede local. Isso não foi verificado, portanto nenhuma opção é recomendada a partir disso. O mesmo feedback diz que a AIR e a DashChat planejam suporte a servidor local e carecem de financiamento comprometido ou de um roteiro. Isso também não foi verificado. O [relatório FIFAfrica 2026](https://likebutter.app/blog/fifafrica-2026) descreve uma demonstração offline da DashChat. A DashChat rodou offline com uma Butter Box como seu servidor, e seu hub de mensagens local foi adicionado à Butter Box. O relatório não menciona a AIR. Nem a AIR nem a DashChat são recomendadas ainda.

## Notas de Privacidade

Os servidores do Delta Chat veem os endereços do remetente e do destinatário e o tamanho da mensagem ([FAQ](https://delta.chat/en/help)). Os endereços são aleatórios por padrão. Todos os outros dados de contato e de grupo são criptografados nos dispositivos. Os relays também veem o endereço IP de cada usuário, pois precisam dele para entregar as mensagens ([FAQ](https://delta.chat/en/help)).

Para uso sensível, crie um perfil separado com um endereço aleatório. O FAQ recomenda isso para proteção contra coleta de metadados e apreensão de dispositivos.

Os operadores de relay executam seus próprios servidores. Os relays públicos são executados por diferentes grupos e pessoas ([página de relays](https://chatmail.at/relays)). A documentação do relay descreve como meta a coleta de nenhum dado privado ou metadado ([repositório do relay](https://github.com/chatmail/relay)). Esse é um objetivo de design, não um resultado de auditoria.

A documentação não lista o horário das mensagens como visível para os relays. Os relays provavelmente veem quando as mensagens chegam (inferido).

**Aviso: altere as credenciais padrão da ButterBox antes de implantá-la.** A caixa vem com credenciais padrão documentadas para três contas: o usuário do sistema operacional, o administrador do ponto de acesso e o administrador do chat. A rede Wi-Fi é aberta por padrão, sem senha. Qualquer pessoa por perto pode entrar na rede. Qualquer pessoa que saiba o padrão do administrador do chat pode assumir a administração do chat. Altere as três credenciais e adicione uma senha de Wi-Fi antes que a caixa atenda usuários. O [guia de segurança da ButterBox](https://likebutter.app/docs/security) lista os passos. O [guia de início rápido](https://likebutter.app/docs/quick-start) diz que a rede Wi-Fi é aberta por padrão e mostra como adicionar uma senha de Wi-Fi nas Configurações de Administrador.

## Questões em Aberto

- Qual configuração local o Delta Chat usou na GG2026 não está confirmado. A configuração Delta Chat da ButterBox é uma provável candidata (inferido).
- Se um relay auto-hospedado ou somente-IP funciona sem conexão com a internet é desconhecido. A documentação é silenciosa.
- Se o Autocrypt v2 foi lançado é desconhecido.
- Os detalhes da criptografia de chat da ButterBox são desconhecidos. As fontes analisadas não os descrevem.