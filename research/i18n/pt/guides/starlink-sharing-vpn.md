---
title: Compartilhando Starlink com uma VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 00e901b6fd0866a6
translatedBy: glm-4.6
---

# Compartilhando Uma Conexão Starlink em Uma Rede Comunitária

Algumas redes comunitárias usam uma conexão Starlink como seu link de internet. Este guia explica uma configuração básica para compartilhar esse link. Ele também explica por que membros fora da rede podem não alcançar um servidor no local. Ele permanece conceitual. Não é uma configuração passo a passo.

## O Problema Central: CGNAT

A configuração IPv4 padrão da Starlink não aceita conexões de entrada. A central de ajuda da Starlink diz que ela usa NAT de nível de operadora (CGNAT). O CGNAT permite que muitos clientes compartilhem um endereço público. Ele bloqueia todas as portas de entrada, então um servidor atrás da Starlink não pode ser alcançado de fora por padrão ([Ajuda Starlink: Qual endereço IP a Starlink fornece?](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

A central de ajuda da Starlink diz:

- Um endereço IPv4 público está disponível apenas nos planos Local e Global Priority. Você o ativa no painel da conta. Verifique os termos atuais do plano antes de assumir isso.
- Os roteadores Wi-Fi da própria Starlink não suportam encaminhamento de portas ou regras de firewall para IPv4 ou IPv6.
- Usuários que precisam de acesso de entrada são direcionados a um roteador de terceiros ou a um plano com opção de IPv4 público.

A página de ajuda sobre VPN da Starlink diz que VPNs baseadas em SSL normalmente funcionam melhor através de CGNAT. Ela também diz que o CGNAT descarta os protocolos 47 (GRE), 50 (ESP), 51 (AH) e 115 (L2TP) ([Ajuda Starlink: A Starlink funciona com VPNs?](https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d)).

A central de ajuda também diz que essas condições podem mudar conforme o serviço cresce.

## Por Que uma Overlay Ajuda

Uma VPN ou rede overlay dá a cada dispositivo um endereço privado. Os dispositivos se conectam para fora a um ponto de controle ou retransmissor. O tráfego então se move entre os dispositivos por esse link. Nenhuma porta de entrada na Starlink é necessária.

Duas opções comuns:

- **WireGuard** é um túnel VPN. O projeto o descreve como um [túnel VPN rápido, moderno e seguro](https://www.wireguard.com/). Ele usa um conjunto fixo de primitivas criptográficas, incluindo ChaCha20, Poly1305 e Curve25519 ([página do protocolo WireGuard](https://www.wireguard.com/protocol/)). Você mesmo gerencia as chaves e os peers.
- **Tailscale** é construído sobre o WireGuard. Sua documentação o descreve como uma [plataforma de conectividade Zero Trust baseada em identidade](https://tailscale.com/kb/1151/what-is-tailscale). Sua própria descrição diz que funciona como uma rede overlay entre seus dispositivos e usa NAT traversal ([README do Headscale, citando Tailscale](https://github.com/juanfont/headscale)).
- **Headscale** é um servidor de controle auto-hospedado e de código aberto para clientes Tailscale. Ele cobre um único tailnet, voltado para uso pessoal ou pequenos grupos ([README do Headscale](https://github.com/juanfont/headscale)). O README do Headscale diz que o software cliente da Tailscale é de código aberto, exceto os clientes GUI para Windows, macOS e iOS, e o servidor de controle.

A documentação do Tailscale diz que exit nodes podem rotear todo o tráfego de um dispositivo através de um nó escolhido. Eles também dizem que exit nodes estão disponíveis em todos os planos ([exit nodes do Tailscale](https://tailscale.com/kb/1103/exit-nodes)). Verifique os termos atuais do plano antes de confiar nisso.

## Topologia Básica

Um layout simples:

1. A antena e o roteador Starlink fornecem o link de internet.
2. Um dispositivo gateway executando OpenWrt ou LibreMesh se conecta ao roteador Starlink. O LibreMesh é um [framework para construir firmware baseado em OpenWrt para nós mesh sem fio](https://libremesh.org/).
3. O gateway compartilha o link com os nós mesh.
4. Um cliente de VPN ou overlay no gateway ou em um servidor se conecta para fora a um ponto de controle ou a um peer.
5. Os membros alcançam o servidor comunitário através dessa overlay. O servidor permanece atrás do CGNAT.

O gateway é o ponto crítico. Se ele falhar, toda a rede perde seu link. Planeje um caminho reserva ou um fallback claro.

## Banda Larga e Uso Justo

Um link compartilhado tem capacidade fixa. Muitos membros em um único link podem retardar uns aos outros. Defina limites antes de entrar no ar:

- Decida quem pode usar o link e para quê.
- Monitore o uso ao longo de algumas semanas.
- Dê prioridade aos serviços que a comunidade precisa, como mensageria ou o servidor comunitário.

Os limites de dados, regras de uso justo e políticas de velocidade da Starlink diferem por plano. Este guia não os verificou. Verifique os termos atuais do seu plano.

## Termos de Revenda e Compartilhamento

Os termos de serviço da Starlink regem se você pode compartilhar ou revender a conexão. A página em [starlink.com/legal](https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service) não foi renderizada na busca usada para este guia. Não presuma que o compartilhamento é permitido. Leia os termos e pergunte ao suporte da Starlink por escrito antes de compartilhar o link com uma comunidade.

## Questões em Aberto

- As regras de compartilhamento e revenda nos termos de serviço da Starlink não foram verificadas. Veja a seção acima.
- (inferido) Se o endereço IPv4 público do plano Priority funciona para os dispositivos de todos os membros da comunidade. Não testado.
- (inferido) Se um determinado roteador de terceiros pode repassar um endereço público através da Starlink. Não verificado nas fontes obtidas.
- Limites de dados e política de uso justo dos planos atuais da Starlink. Não verificado.

## Fontes

Obtidas em 2026-10-30. As páginas de ajuda da Starlink retornaram apenas cascas de página na busca. As alegações sobre a Starlink acima vêm de trechos de pesquisa dessas mesmas URLs da central de ajuda, então verifique-as nas páginas ao vivo.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (endereço IP, CGNAT, planos IPv4 públicos, limitações do roteador)
- https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d (orientação sobre VPN, protocolos descartados pelo CGNAT)
- https://www.wireguard.com/ (descrição e criptografia do WireGuard)
- https://www.wireguard.com/protocol/ (primitivas usadas)
- https://tailscale.com/kb/1151/what-is-tailscale (descrição do Tailscale)
- https://tailscale.com/kb/1103/exit-nodes (exit nodes)
- https://github.com/juanfont/headscale (propósito do Headscale, status de código aberto)
- https://libremesh.org/ (descrição do LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (não renderizada; listada para verificação dos termos)