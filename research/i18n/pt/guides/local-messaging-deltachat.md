---
title: Mensagens locais com Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: 56d6e6626521f5c7
translatedBy: glm-4.6
---

# Mensagens Locais com Delta Chat

Este guia explica o Delta Chat e sua rede de retransmissores (relays). Ele mostra o que a documentação oficial descreve para uso offline. Ele compara três opções para uma Community Box.

## O que é o Delta Chat

O [Delta Chat](https://delta.chat/en/) é um mensageiro livre e de código aberto. Ele funciona em Android, iOS e desktop. Baixe os aplicativos em [get.delta.chat](https://get.delta.chat).

O Delta Chat usa padrões de e-mail da internet. As mensagens trafegam por relays chatmail, que são servidores de e-mail. O Delta Chat usa um subconjunto seguro do OpenPGP para criptografia de ponta a ponta. Os contatos trocam chaves por código QR ou link de convite, usando o Secure-Join ([FAQ](https://delta.chat/en/help)).

O Autocrypt configura automaticamente a criptografia entre contatos e membros de grupos ([FAQ](https://delta.chat/en/help)). O FAQ diz que o Autocrypt v2 está previsto para 2026. Este guia não verificou se ele já foi lançado.

## Relays Chatmail

Um relay guarda as mensagens enquanto um dispositivo está offline. Os relays não armazenam nomes de grupos, avatares ou detalhes de contatos ([FAQ](https://delta.chat/en/help)).

Por padrão, o aplicativo configura os relays para você ([FAQ](https://delta.chat/en/help)). A página [chatmail.at/relays](https://chatmail.at/relays) lista relays públicos. Ela cita o nine.testrun.org como o relay de integração padrão para muitos aplicativos chatmail.

Uma comunidade pode executar seu próprio relay. O [repositório do relay](https://github.com/chatmail/relay) contém as ferramentas de configuração. O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) lista estes requisitos:

- Um servidor Debian 12 com portas SMTP, submission, IMAPS e HTTPS acessíveis.
- 1 GB de RAM, uma CPU e cerca de 10 GB de armazenamento para alguns milhares de endereços.
- Controle de um domínio por meio de um provedor de DNS.
- Uma máquina de build com acesso por chave SSH ao usuário root do servidor.

A configuração precisa de registros DNS A e AAAA para o domínio. Domínios que começam com sublinhado usam certificados autoassinados em vez de Let's Encrypt.

A documentação descreve um relay experimental somente por IP. Ele não precisa de domínio e pode usar um endereço IPv4 em uma rede local. A [página de IP-only](https://chatmail.at/doc/relay/iponly.html) indica três limitações:

- A opção é experimental e pode mudar sem aviso.
- A criptografia de transporte usa certificados autoassinados, que a página chama de vulneráveis a ataques man-in-the-middle.
- As mensagens não são assinadas com DKIM. Alguns relays podem rejeitá-las.

A documentação não diz se um relay funciona sem link de internet. Este guia trata isso como desconhecido.

## Recursos Locais e Offline na Documentação

A documentação oficial descreve estes recursos locais:

- **Transferência para segundo dispositivo.** Ambos os dispositivos devem estar na mesma rede Wi-Fi ou rede. Um código QR inicia a transferência ([FAQ](https://delta.chat/en/help)).
- **Fallback por hotspot móvel.** Se os dispositivos não conseguirem se ver, o FAQ sugere um hotspot de celular.
- **Contato presencial.** Um código QR adiciona um membro pessoalmente ([FAQ](https://delta.chat/en/help)).
- **Aplicativos no chat.** Aplicativos Webxdc são arquivos zip que rodam dentro dos chats ([webxdc FAQ](https://delta.chat/en/help)).

A documentação não descreve um modo de chat somente em LAN. A documentação não diz que o chat funciona sem um relay. Nenhuma fonte oficial nesta revisão confirma chat offline entre dois aplicativos Delta Chat.

## Opções para uma Community Box

| Opção | Precisa de internet? | Precisa de domínio? | Esforço |
|---|---|---|---|
| (a) Relays chatmail públicos | Sim | Não | Baixo: instalar o aplicativo e escolher um relay |
| (b) Auto-hospedar um relay chatmail | Sim para uso público. Uso somente em LAN não documentado | Sim para a configuração padrão. A opção IP-only é experimental | Alto: servidor Debian 12, DNS, SSH, ferramentas de deploy |
| (c) ButterBox em um Raspberry Pi | Não | Não | Médio: construir ou obter a caixa |

A opção (a) serve para um local com acesso à internet. A opção (b) serve para um local que possa hospedar um servidor com DNS público.

A ButterBox é a opção offline nesta revisão. Ela transmite sua própria rede Wi-Fi. A [Butter Box](https://likebutter.app/) diz que funciona sem internet. Os usuários entram em um chatroom público ou criam um privado. O site lista chat criptografado como recurso. Ele diz que tudo é armazenado na caixa. A [documentação](https://likebutter.app/docs) descreve a caixa como um hotspot com conteúdo local.

Na GG2026, o Delta Chat e a ButterBox funcionaram em uma rede local, segundo feedback da comunidade. AIR e DashChat prometeram suporte a servidor local. Eles não têm financiamento ou roteiro comprometidos, então ainda não são recomendados.

## Notas de Privacidade

Os servidores do Delta Chat veem endereços de remetente e destinatário e o tamanho das mensagens ([FAQ](https://delta.chat/en/help)). Os endereços são aleatórios por padrão. Todos os outros dados de contato e grupo são criptografados nos dispositivos.

Para uso sensível, crie um perfil separado com um endereço aleatório. O FAQ recomenda isso para proteção contra coleta de metadados e apreensão de dispositivos.

Os operadores de relay executam seus próprios servidores. Os relays públicos são executados por diferentes grupos e pessoas ([página de relays](https://chatmail.at/relays)). A documentação do relay descreve como meta a coleta de nenhum dado privado ou metadado ([repositório do relay](https://github.com/chatmail/relay)). Isso é um objetivo de design, não um resultado de auditoria.

A documentação não lista o horário das mensagens como visível para os relays. Os relays provavelmente veem quando as mensagens chegam (inferido).

O site da ButterBox diz apenas que tem chat criptografado. Não há página de segurança nas fontes revisadas.

## Questões em Aberto

- Qual transporte local funcionou na GG2026 é desconhecido. Isso está pendente da decisão Q20. Confirme com o demonstrador antes de publicar.
- Se um relay auto-hospedado ou IP-only funciona sem link de internet é desconhecido. A documentação é silenciosa.
- Se dois aplicativos Delta Chat podem conversar em uma LAN sem relay é desconhecido (inferido: um relay é necessário).
- Se o Autocrypt v2 já foi lançado é desconhecido.
- Os detalhes da criptografia do chat da ButterBox são desconhecidos. As fontes revisadas não os descrevem.