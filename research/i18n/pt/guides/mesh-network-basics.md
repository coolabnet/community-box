---
title: Fundamentos de Mesh
sourcePath: guides/mesh-network-basics.md
sourceHash: 7c2ff6e29116e57c
translatedBy: glm-4.6
---

# Fundamentos de Redes Mesh

## Introdução às Redes Mesh

As redes mesh representam uma abordagem fundamentalmente diferente da arquitetura de rede em comparação com os modelos tradicionais de hub-and-spoke. Nas redes mesh, os dispositivos (nós) conectam-se de forma direta, dinâmica e não hierárquica a tantos outros nós quanto possível, criando múltiplos caminhos para a transmissão de dados[13]. Essa estrutura descentralizada oferece várias vantagens sobre as redes convencionais, particularmente em implantações comunitárias.

`[Wireless Channel Map](wireless-channel-map.png) — Example showing proper channel selections to reduce interference.]`

## Conceitos Fundamentais de Redes para LibreMesh

### Roteamento em Redes Mesh

As redes mesh lidam com o roteamento por meio de comunicação ponto a ponto, onde cada nó atua tanto como remetente quanto como receptor de dados[12]. Essa abordagem cooperativa de transmissão de dados cria redes resilientes que podem manter a conectividade mesmo quando nós individuais falham.

#### Protocolos de Roteamento

O LibreMesh emprega dois protocolos de roteamento principais em sua arquitetura de dupla camada[20]:

1. **BATMAN-adv (Better Approach To Mobile Ad hoc Networking)**: Um protocolo de camada 2 que cria um switch de rede virtual a partir dos nós mesh, fazendo com que toda a mesh apareça como uma única rede link-local. Este protocolo:
   - Lida com roteamento de camada 2 (endereçamento MAC)
   - Permite roaming contínuo dentro de uma nuvem mesh
   - Cria o que parece aos clientes ser um único domínio de colisão de rede
   - Funciona na camada de enlace de dados (camada 2 do OSI)

2. **Babel**: Um protocolo de roteamento distance-vector para IPv6 e IPv4 com propriedades de convergência rápida. Este protocolo:
   - Lida com roteamento de camada 3 (endereçamento IP)
   - Fornece conectividade entre nuvens
   - Permite seleção inteligente de gateway
   - Funciona na camada de rede (camada 3 do OSI)

### Conceitos de Topologia de Rede

As redes mesh podem implementar diferentes estruturas de topologia dependendo das necessidades[18]:

- **Mesh Completa**: Cada nó se comunica diretamente com todos os outros nós
- **Mesh Parcial**: Os nós se comunicam principalmente com nós próximos, com os dados "saltando" por vários nós para alcançar destinos distantes

O LibreMesh suporta ambas as configurações, sendo a mesh parcial mais comum em implantações maiores por questões de eficiência.

`[Node Discovery UI Screenshot](node-discovery-ui.png) — LibreMesh's interface showing known nodes.]`

### Configuração Automática

Um recurso crítico do LibreMesh é sua capacidade de configurar automaticamente os parâmetros de rede[20]. Isso inclui:

- **Descoberta de Nós**: Detecção automática de outros nós mesh dentro do alcance
- **Estabelecimento de Rotas**: Criação dinâmica de caminhos de roteamento otimizados
- **Atribuição de Endereços**: Alocação automática de endereços IP com base em algoritmos determinísticos
- **Seleção de Gateway**: Escolha inteligente dos pontos de saída para a internet

Essa autoconfiguração reduz significativamente a expertise técnica necessária para implantar e manter redes mesh.

## Arquitetura de Rede no LibreMesh

### Design de Dupla Camada

A arquitetura de rede do LibreMesh é construída sobre um sistema de duas camadas que proporciona tanto flexibilidade quanto desempenho[8][17][20]:

#### Nuvem de Camada 2

A camada de nuvem usa BATMAN-adv para criar "nuvens" mesh — segmentos de rede local que funcionam como um único domínio de colisão. As principais características incluem:

- Todos os dispositivos dentro de uma nuvem aparecem na mesma rede local
- Roaming contínuo para dispositivos clientes dentro da nuvem
- Isolamento do tráfego de broadcast dentro dos limites da nuvem
- Redes locais simplificadas com descoberta automática

#### Rede de Camada 3

A camada de rede usa Babel (anteriormente BMX6/BMX7) para interconectar diferentes nuvens e lidar com o roteamento entre elas. Isso proporciona:

- Conectividade escalável entre nuvens mesh separadas
- Seleção inteligente de gateway para acesso à internet
- Redução do tráfego de broadcast em toda a rede
- Roteamento nativo IPv6 com compatibilidade IPv4

### Segmentação VLAN

O LibreMesh emprega marcação VLAN para isolar os protocolos de roteamento[17]:

- A VLAN do Babel é consistente em todos os nós, permitindo que nós conectados na camada de enlace se encontrem
- A VLAN do BATMAN-adv depende de um identificador de nuvem (tipicamente derivado do SSID do AP)
- Essa configuração permite isolar nuvens de camada 2 enquanto mantém a conectividade de camada 3

## Planejamento de Canais Sem Fio

### Princípios de Seleção de Canais

A seleção adequada de canais é crucial para o desempenho de redes mesh sem fio[34][35]:

#### Considerações para 2.4 GHz

- Apenas os canais 1, 6 e 11 são não sobrepostos na maioria das regiões
- A interferência de canal adjacente (ACI) ocorre quando nós próximos usam canais parcialmente sobrepostos
- A interferência de co-canal (CCI) acontece quando nós dentro do alcance usam o mesmo canal

#### Planejamento para 5 GHz

- Mais canais disponíveis permitem melhor reutilização espacial
- Os canais de Seleção Dinâmica de Frequência (DFS) podem exigir capacidades de detecção de radar
- Frequências mais altas têm alcance reduzido, mas geralmente menos interferência

### Estratégias de Alocação de Canais

Para um desempenho mesh otimizado, considere estas estratégias de planejamento de canais:

1. **Separação de Canais**: Garanta que os enlaces backhaul da mesh usem canais diferentes do acesso dos clientes
2. **Reutilização Espacial**: Planeje a atribuição de canais com base na posição física dos nós
3. **Mitigação de Interferência**: Selecione canais com interferência externa mínima
4. **Conformidade Regulatória**: Aderência às regulamentações locais de uso de frequência e níveis de potência

## Tolerância a Falhas e Redundância

### Redundância de Caminhos

As redes mesh se destacam por fornecer múltiplos caminhos para a transmissão de dados[18][19]. Essa redundância garante:

- A comunicação pode continuar se nós individuais falharem
- O tráfego pode ser redirecionado ao redor de nós congestionados ou danificados
- A capacidade da rede pode escalar com nós adicionais

### Capacidades de Autorreparo

As redes LibreMesh se adaptam automaticamente às mudanças nas condições[18]:

- Detecção de falhas de nós e estabelecimento de rotas alternativas
- Adaptação à qualidade variável dos enlaces selecionando caminhos ótimos
- Incorporação de novos nós à mesh conforme eles ficam online
- Balanceamento do tráfego pelos caminhos disponíveis

## Roaming em Redes Mesh

### Roaming de Camada 2

Uma vantagem significativa da implementação do BATMAN-adv no LibreMesh é seu suporte a roaming contínuo de camada 2[8][17][20][42]:

- Os dispositivos podem se mover entre pontos de acesso sem alterar endereços IP
- As conexões ativas (sessões TCP, streams de vídeo, chamadas VoIP) permanecem intactas durante as transições
- Nenhuma configuração especial do cliente é necessária para suporte a roaming

### Limitações do Roaming

O roaming no LibreMesh tem algumas restrições[42]:

- O roaming funciona apenas dentro de uma única nuvem BATMAN-adv
- Os dispositivos não podem fazer roaming contínuo entre nuvens mesh diferentes
- O desempenho do roaming depende parcialmente das capacidades do dispositivo cliente

## Considerações de Desempenho

### Configurações Multi-Rádio

Para desempenho otimizado, os nós mesh podem usar múltiplos rádios[7]:

- Um rádio para conexões backhaul da mesh (idealmente 5 GHz)
- Outro rádio para acesso dos clientes (tipicamente 2.4 GHz)
- Rádios adicionais para enlaces ponto a ponto dedicados

### Escalabilidade da Rede

As redes LibreMesh podem escalar por meio de um design bem pensado[8]:

- Segmentação de redes maiores em múltiplas nuvens mesh
- Uso de antenas direcionais para enlaces de longa distância
- Implementação de estruturas de rede hierárquicas para grandes implantações
- Posicionamento cuidadoso de gateways e planejamento de capacidade

## Conceitos Avançados de Mesh

### Roteamento Baseado em Qualidade

Os protocolos mesh modernos consideram a qualidade do enlace ao tomar decisões de roteamento[16]:

- Medição das taxas de entrega de pacotes entre nós
- Cálculo dos tempos de transmissão por diferentes caminhos
- Adaptação às mudanças nas condições sem fio
- Balanceamento entre o caminho mais curto e o de maior qualidade

### Segmentação de Rede

O LibreMesh suporta segmentação lógica de redes[8][17]:

- Criação de nuvens mesh separadas para diferentes áreas ou propósitos
- Isolamento de domínios de broadcast para melhorar o desempenho
- Implementação de fronteiras de segurança entre segmentos de rede
- Permissão de políticas diferentes em diferentes partes da rede
## Solução de Problemas de Conectividade Mesh

### Problemas Comuns e Soluções

Ao solucionar problemas de redes mesh, considere estes cenários comuns[56]:

1. **Rede mesh visível mas sem conectividade com a internet**
   - Verifique se pelo menos um ponto de acesso raiz está conectado via LAN com fio
   - Confirme se a configuração do gateway está correta
   - Garanta o roteamento adequado entre a mesh e o gateway da internet

2. **Rede mesh não visível**
   - Aguarde tempo suficiente (até 5 minutos) para a inicialização da rede
   - Verifique se os pontos de acesso mesh estão no mesmo canal
   - Verifique se o Spanning Tree Protocol está bloqueando a configuração da mesh

3. **Nós ausentes na rede mesh**
   - Garanta que todos os nós tenham a configuração adequada
   - Verifique a compatibilidade do canal sem fio
   - Verifique o posicionamento físico e a distância entre os nós

4. **Desempenho ruim**
   - Procure por interferência de canal
   - Verifique a intensidade do sinal entre os nós
   - Verifique o posicionamento e a orientação das antenas
   - Monitore clientes ou serviços que consomem muita largura de banda

## Próximos Passos

Para uma implementação prática desses conceitos:

- Consulte [libremesh-overview.md](./libremesh-overview.md) para uma compreensão mais ampla do LibreMesh
- Siga [libremesh-installation.md](./libremesh-installation.md) para orientações sobre hardware e instalação
- Consulte [dns-configuration.md](./dns-configuration.md) para a configuração de serviços locais

Ao compreender esses conceitos fundamentais de redes mesh, você estará mais preparado para projetar, implantar e manter uma rede LibreMesh eficaz que atenda às necessidades da sua comunidade.