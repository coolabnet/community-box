---
title: Compartilhando Starlink com uma VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 4f2438bb31534309
translatedBy: glm-4.6
---

# Compartilhando Uma Conexão Starlink em Uma Rede Comunitária

Algumas redes comunitárias usam uma conexão Starlink como seu link de internet. Este guia explica uma configuração básica para compartilhar esse link e por que membros fora da rede podem não alcançar um servidor no local. Ele é conceitual, não uma configuração passo a passo.

## IPv4 É Bloqueado para Entrada; IPv6 É Diferente

A configuração IPv4 padrão da Starlink usa NAT de nível de operadora (CGNAT), que compartilha um endereço público entre muitos clientes. Conexões IPv4 de entrada são bloqueadas ([ajuda da Starlink](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

A Starlink também fornece IPv6 nativo em seus planos, com um /64 para o lado WAN e um /56 para o lado LAN ([mesmo artigo](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4); [FAQ Enterprise](https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8)). IPv6 de entrada ainda precisa de uma regra de roteador ou firewall para o host e porta específicos. Os roteadores Wi-Fi da própria Starlink não oferecem encaminhamento de portas ou regras de firewall, então um roteador de terceiros é a escolha comum. IPv4 público é uma opção separada, disponível apenas em alguns planos.

Muitas redes às quais os membros se conectam ainda carecem de IPv6 (inferido). Portanto, uma VPN ou overlay continua sendo a opção mais portátil.

## Por que um Overlay Ajuda

Uma VPN ou overlay dá a cada dispositivo um endereço privado e um túnel criptografado. O túnel ainda precisa de um caminho que ambos os lados possam alcançar.

- **WireGuard** é um [túnel VPN rápido, moderno e seguro](https://www.wireguard.com/). Seu [início rápido](https://www.wireguard.com/quickstart/) configura cada peer com um endpoint e intervalos de IP permitidos. Um peer deve ser alcançável em um endereço conhecido. Se ambos os lados estiverem atrás de CGNAT IPv4, é necessário um terceiro host com um endereço alcançável, como um pequeno servidor alugado ou um caminho IPv6. O início rápido não diz o que acontece quando ambos os lados estão inalcançáveis.
- **Tailscale** roda sobre WireGuard. Os nós começam através de servidores DERP, que os ajudam a se encontrar. O Tailscale então tenta uma conexão direta. Os relays DERP carregam tráfego apenas quando nenhum caminho direto funciona. O tráfego retransmitido permanece criptografado de ponta a ponta ([tipos de conexão](https://tailscale.com/docs/reference/connection-types)).
- **Headscale** é um servidor de controle auto-hospedado para clientes Tailscale. Ele troca chaves públicas WireGuard e atribui endereços ([README](https://github.com/juanfont/headscale)). Ele não retransmite tráfego por si só. Ele tem um servidor DERP embutido, desativado por padrão, que retransmite tráfego entre nós quando nenhuma conexão direta pode ser feita ([documentação DERP do Headscale](https://headscale.net/stable/ref/derp/)). Uma configuração Headscale pode retransmitir, mas apenas se você habilitar e hospedar esse componente.

## Alcançando um Servidor na Rede Local

Um túnel no gateway não, por si só, torna um servidor LAN alcançável. Duas opções:

- **O servidor executa o cliente do túnel.** Ele obtém seu próprio endereço de túnel, e os membros o alcançam diretamente. Esta é a opção mais simples.
- **O gateway anuncia a sub-rede LAN.** Este é um roteador de sub-rede. Um administrador aprova a rota anunciada, e o gateway encaminha pacotes entre as interfaces. As regras de firewall devem permitir o tráfego até o servidor. As respostas devem retornar através do gateway (inferido). O [guia de roteador de sub-rede do Tailscale](https://tailscale.com/docs/features/subnet-routers/how-to/setup) cobre anunciar, aprovar e encaminhar. Ele não cobre totalmente o roteamento de retorno, então teste isso na sua rede.

Com WireGuard, o equivalente são os intervalos de IP permitidos do peer mais regras de encaminhamento e firewall no gateway.

## Protocolos Que o CGNAT Descarta

O artigo Starlink site-to-site lista os protocolos que o CGNAT descarta: IP protocol 47 (GRE), 50 (ESP), 51 (AH) e 115 (L2TP) ([ajuda da Starlink](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). O Protocolo 115 é um número de protocolo IP, não L2TP sobre UDP. Teste seu túnel no link real antes de entrar em produção.

## Topologia Básica

1. A antena e o roteador Starlink fornecem o link de internet.
2. Um gateway executando OpenWrt ou [LibreMesh](https://libremesh.org/) se conecta ao roteador Starlink e compartilha o link com os nós da mesh.
3. Um cliente de túnel no gateway ou no servidor se conecta a um peer ou relay alcançável.
4. Os membros alcançam o servidor da comunidade através do túnel, usando uma das opções de roteamento acima.

O gateway é um ponto único de falha. Planeje um caminho reserva ou um fallback.

## Largura de Banda, Termos e Uso Justo

Um link compartilhado tem capacidade fixa. Decida quem pode usá-lo e para quê, e dê prioridade aos serviços que a comunidade mais precisa. Os limites de dados e as regras de uso justo da Starlink diferem por plano, e este guia não os verificou.

Os termos de serviço da Starlink governam se você pode compartilhar ou revender a conexão. A página de termos não foi renderizada na busca usada para este guia. Não presuma que o compartilhamento é permitido. Pergunte ao suporte da Starlink por escrito primeiro.

## Questões em Aberto

- As regras de compartilhamento e revenda nos termos de serviço da Starlink não foram verificadas.
- Se o IPv6 de entrada funciona através do seu roteador e plano. Teste.
- (inferido) Até onde um servidor apenas-IPv6 alcança, dado quantas redes de clientes carecem de IPv6.
- (inferido) Detalhes de caminho de retorno e NAT para um roteador de sub-rede.
- (inferido) Como o artigo da Starlink classifica o L2TP sobre UDP, que usa UDP em vez do IP protocol 115.

## Fontes

Buscado em 2026-10-30. O WebFetch das páginas da central de ajuda da Starlink retornou apenas a palavra "Starlink", então as declarações sobre a Starlink vêm de trechos de pesquisa das URLs abaixo. Verifique-os nas páginas ao vivo.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (CGNAT, prefixos IPv6; trecho)
- https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8 (FAQ Enterprise, prefixo IPv6; trecho)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (lista de protocolos; trecho)
- https://www.wireguard.com/ e https://www.wireguard.com/quickstart/ (descrição do WireGuard, configuração de peers)
- https://tailscale.com/docs/reference/connection-types (DERP primeiro, conexão direta, criptografia)
- https://tailscale.com/docs/features/subnet-routers/how-to/setup (anúncio e aprovação de rotas, encaminhamento)
- https://github.com/juanfont/headscale (papel do servidor de controle)
- https://headscale.net/stable/ref/derp/ (DERP embutido, desativado por padrão)
- https://libremesh.org/ (descrição do LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (não renderizou)