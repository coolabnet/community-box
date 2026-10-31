---
title: Compartilhando Starlink com uma VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 9380975334445211
translatedBy: glm-4.6
---

# Compartilhando Uma Conexão Starlink em Uma Rede Comunitária

Algumas redes comunitárias usam uma conexão Starlink como seu link de internet. Este guia explica uma configuração básica para compartilhar esse link. Também explica por que membros fora da rede podem não conseguir acessar um servidor no local. Ele permanece conceitual. Não é uma configuração passo a passo.

## O Problema Central: CGNAT e Acesso de Entrada

A central de ajuda da Starlink diz que sua configuração IPv4 padrão usa NAT de nível de operadora (CGNAT). O CGNAT permite que muitos clientes compartilhem um endereço público. Conexões de entrada são bloqueadas, então um servidor atrás da configuração padrão não pode ser acessado de fora ([Ajuda Starlink: endereço IP](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Pontos dessa central de ajuda para verificar nas páginas ao vivo:

- Um endereço IPv4 público depende do plano. A central de ajuda menciona os planos Local e Global Priority.
- Os roteadores Wi-Fi da própria Starlink não suportam encaminhamento de portas nem regras de firewall para IPv4 ou IPv6.
- Membros que precisam de acesso de entrada são direcionados a um roteador de terceiros ou a um plano com opção de IPv4 público.

O IPv6 pode oferecer outra rota para acesso de entrada. Confirme no seu plano se o IPv6 nativo é fornecido e se o seu roteador o repassa. Veja Questões em Aberto.

## Por Que uma Overlay Ajuda

Uma VPN ou rede overlay dá a cada dispositivo um endereço privado e um túnel criptografado para os outros. O túnel ainda precisa de um caminho que ambos os lados possam alcançar. Esse caminho é a parte difícil atrás do CGNAT.

- **WireGuard** é um [túnel VPN rápido, moderno e seguro](https://www.wireguard.com/). Seu [guia de início rápido](https://www.wireguard.com/quickstart/) configura cada peer com um endereço de endpoint e faixas de IP permitidas. O WireGuard puro precisa de um peer que o outro lado possa alcançar em um endereço conhecido. Se o servidor e o cliente estiverem ambos atrás do CGNAT, nenhum deles pode aceitar a conexão. Um terceiro host com endereço público, como um pequeno servidor alugado, é então necessário. Pacotes keepalive ajudam a manter os mapeamentos NAT abertos. O guia de início rápido não descreve o que acontece quando ambos os lados estão inacessíveis.
- **Tailscale** roda sobre o WireGuard. Sua [página de tipos de conexão](https://tailscale.com/docs/reference/connection-types) diz que os dispositivos primeiro tentam conexões diretas via UDP. Quando nenhum caminho direto funciona, o tráfego passa pelos servidores de relay DERP, e o tráfego retransmitido permanece criptografado de ponta a ponta com o WireGuard.
- **Headscale não é um relay.** [Headscale](https://github.com/juanfont/headscale) é um servidor de controle auto-hospedado para clientes Tailscale. Seu README diz que o servidor de controle troca chaves públicas WireGuard entre os nós e atribui endereços. Ele não carrega o tráfego dos membros. Uma configuração Headscale atrás do CGNAT ainda precisa de um caminho que funcione. Consulte a documentação do próprio Headscale para opções de relay (inferido).

## Protocolos Que o CGNAT Descarta

O artigo da Starlink sobre site-to-site lista os protocolos que o CGNAT descarta: protocolo IP 47 (GRE), 50 (ESP), 51 (AH) e 115 (L2TP) ([Ajuda Starlink: VPN site-to-site](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). O protocolo 115 é um número de protocolo IP. Não é o mesmo que L2TP sobre UDP. Teste o túnel escolhido no link Starlink real antes de entrar em operação.

## Topologia Básica

1. A antena e o roteador Starlink fornecem o link de internet.
2. Um gateway executando OpenWrt ou LibreMesh se conecta ao roteador Starlink. O LibreMesh é uma [estrutura de firmware baseado em OpenWrt para nós de malha sem fio](https://libremesh.org/).
3. O gateway compartilha o link com os nós da malha.
4. Um cliente de túnel no gateway ou um servidor se conecta a um peer ou relay acessível.
5. Os membros acessam o servidor comunitário através desse túnel. O próprio servidor permanece atrás do CGNAT.

O gateway é um ponto único de falha. Planeje um caminho reserva ou um fallback claro.

## Banda Larga e Uso Justo

Um link compartilhado tem capacidade fixa, e muitos membros podem deixar uns aos outros mais lentos. Decida quem pode usar o link e para quê. Monitore o uso por algumas semanas. Dê prioridade aos serviços de que a comunidade mais precisa. Os limites de dados e as regras de uso justo da Starlink diferem por plano e não foram verificados aqui.

## Termos de Revenda e Compartilhamento

Os termos de serviço da Starlink regem se você pode compartilhar ou revender a conexão. A página de termos não foi renderizada na busca usada para este guia. Não assuma que o compartilhamento é permitido. Leia os termos e pergunte ao suporte da Starlink por escrito antes de compartilhar o link com uma comunidade.

## Questões em Aberto

- As regras de compartilhamento e revenda nos termos de serviço da Starlink não foram verificadas.
- Se a Starlink fornece IPv6 nativo no seu plano e se um roteador de terceiros pode repassar o IPv6 de entrada a um servidor. Confirme nas páginas ao vivo.
- (inferido) Se as declarações acima ainda correspondem às páginas de ajuda ao vivo.
- (inferido) Como o artigo da Starlink classifica o L2TP sobre UDP, que usa UDP em vez do protocolo IP 115. Confirme com a Starlink.
- Se o endereço IPv4 público funciona para todos os dispositivos da comunidade. Não testado.

## Fontes

Coletado em 2026-10-30. O WebFetch das páginas da central de ajuda da Starlink retornou apenas a palavra "Starlink", então as declarações sobre a Starlink acima vêm de trechos de busca dessas mesmas URLs. Verifique-as nas páginas ao vivo antes de confiar nelas.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (endereço IP e CGNAT; apenas trecho)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (VPN site-to-site, lista de protocolos; apenas trecho)
- https://www.wireguard.com/ (descrição do WireGuard)
- https://www.wireguard.com/quickstart/ (endpoints de peers, faixas de IP permitidas, keepalives)
- https://tailscale.com/docs/reference/connection-types (conexões diretas, fallback de relay DERP, criptografia)
- https://github.com/juanfont/headscale (papel do servidor de controle, não é um relay)
- https://libremesh.org/ (descrição do LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (não renderizou; listado para a verificação dos termos)