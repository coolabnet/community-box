---
title: LibreMesh
sourcePath: guides/libremesh-overview.md
sourceHash: 9d33d1cb9a17620a
translatedBy: glm-4.6
---

# Visão Geral do LibreMesh

## Introdução ao LibreMesh

LibreMesh é um framework modular para criação de firmwares baseados em OpenWrt para nós de mesh sem fio, projetado especificamente para redes comunitárias[1][10]. Várias comunidades ao redor do mundo usam o LibreMesh como base de seus firmwares mesh locais, permitindo redes sem fio descentralizadas e gerenciadas pela comunidade.

`[Mesh Network Topology Illustration](mesh-network-topology.png) — Diagram of mesh-connected routers in a typical deployment.`

O LibreMesh representa uma mudança fundamental das redes sem fio centralizadas tradicionais para infraestrutura distribuída e controlada pela comunidade. Diferentemente das configurações sem fio convencionais que dependem de um único ponto de acesso ou roteador, o LibreMesh cria redes mesh autoconfiguráveis, onde cada nó pode rotear tráfego para outros participantes, eliminando pontos únicos de falha[10].

`[LibreMesh Logo or Screenshot](libremesh-logo.png) — Identifying the project visually.`

## Recursos Principais e Benefícios

### Configuração Automática de Rede

A principal força do LibreMesh está em sua natureza autoconfigurável[1]. O firmware permite a implantação simples de redes mesh versáteis e de múltiplos rádios, sem exigir grande conhecimento técnico dos membros da comunidade. Uma vez instalados, os nós descobrem automaticamente uns aos outros e estabelecem conexões mesh usando protocolos de roteamento sofisticados.

### Arquitetura de Rede de Duas Camadas

O LibreMesh implementa uma arquitetura de rede única de duas camadas que fornece escalabilidade e segmentação[8][20]:

**Camada 2 (Camada de Nuvem)**: Usa o protocolo de roteamento BATMAN-adv (Better Approach To Mobile Ad hoc Networking), que cria um domínio de colisão virtual de camada 2 através de múltiplos saltos. Isso permite roaming contínuo para dispositivos dentro da mesma "nuvem"[17][20].

**Camada 3 (Camada de Rede)**: Emprega o protocolo de roteamento Babel (anteriormente BMX6/BMX7) para roteamento dinâmico nativo IPv6 com recursos avançados e sobrecarga mínima de rede[17][20].

### Seleção Inteligente de Gateway

O sistema fornece seleção inteligente de gateway com redundância e capacidade de escolha do usuário[8]. Múltiplas conexões de internet podem ser compartilhadas pela rede mesh, com failover automático quando as conexões principais ficam indisponíveis.

### Suporte a Múltiplos Rádios

O LibreMesh suporta configurações de múltiplos rádios, permitindo que roteadores usem diferentes faixas de frequência simultaneamente para conexões backbone da mesh e acesso de clientes[5]. Essa separação melhora o desempenho da rede, reduzindo interferências entre tráfego de backhaul e de acesso.

## Topologias de Rede

### Redes Mesh Comunitárias

O LibreMesh se destaca em implantações em escala comunitária, onde bairros, áreas rurais ou distritos urbanos criam infraestrutura sem fio compartilhada. Topologias comuns incluem:

- **Redes de Vizinhança**: Conectar residências e pequenas empresas dentro de uma área geográfica
- **Conectividade Rural**: Conectar locais remotos com infraestrutura limitada de internet
- **Mesh Urbana**: Fornecer conectividade redundante em ambientes urbanos densos
- **Redes de Campus**: Apoiar instituições educacionais ou centros comunitários

### Infraestrutura Híbrida

O framework suporta implantações híbridas que combinam:
- Conexões backbone mesh entre pontos estratégicos
- Serviços tradicionais de ponto de acesso para usuários finais
- Links backbone com fio onde disponíveis
- Múltiplas conexões de gateway de internet

## Casos de Uso Comuns em Redes Comunitárias

### Compartilhamento de Internet

Comunidades podem reunir recursos para compartilhar conexões de internet, reduzindo custos individuais enquanto melhoram a confiabilidade por meio de redundância[22]. A mesh equilibra automaticamente o tráfego entre os gateways disponíveis.

### Serviços Locais

As redes LibreMesh se destacam na hospedagem de serviços locais acessíveis sem conectividade com a internet:
- Servidores web locais e repositórios de conteúdo
- Plataformas de comunicação comunitária
- Ferramentas locais de compartilhamento de arquivos e colaboração
- Sistemas de comunicação de emergência

### Aplicações Educacionais e Sociais

Muitas implantações se concentram em benefícios educacionais e sociais:
- Fornecer acesso à internet para comunidades carentes
- Apoiar programas de alfabetização digital
- Possibilitar a criação e o compartilhamento de conteúdo local
- Facilitar a organização e a comunicação comunitária

### Emergências e Resposta a Desastres

A natureza resiliente e distribuída das redes mesh as torna valiosas em cenários de emergência:
- Manter a comunicação quando a infraestrutura tradicional falha
- Fornecer acesso à internet durante desastres
- Apoiar esforços de coordenação para resposta a emergências

## Organizações que Apoiam o LibreMesh

O LibreMesh conta com o apoio de diversas organizações ao redor do mundo[10]:

| Organização | Região |
|--------------|--------|
| AlterMundi | Argentina |
| FreiFunk | Alemanha |
| FunkFeuer | Áustria |
| Guifi | Península Ibérica |
| Ibebrasil | Brasil |
| LibreRouter | Global |
| Ninux.org | Itália |
| Wakoma | Global |

## Redes Comunitárias que Usam LibreMesh

Implantações ativas demonstram sucesso no mundo real[10]:

| Rede | Local |
|---------|----------|
| Antennine | Apenino Bolonhês |
| Calafou | Catalunha |
| Coolab | Brasil |
| Janastu CowMesh | Karnataka Rural |

## Filosofia Técnica

### Hardware e Software de Código Aberto

O LibreMesh incorpora os princípios da tecnologia aberta, com todos os softwares e muitos designs de hardware disponíveis sob licenças abertas[4]. Essa transparência permite que as comunidades compreendam, modifiquem e mantenham suas redes de forma independente.

### Propriedade Comunitária

O projeto enfatiza a propriedade e o controle comunitário sobre a infraestrutura de rede, afastando-se da dependência de provedores comerciais ou autoridades centralizadas[10]. Essa abordagem está alinhada com movimentos mais amplos em direção à soberania digital e à resiliência comunitária.

### Escalabilidade e Modularidade

O design modular permite que as comunidades comecem pequenas e cresçam organicamente, adicionando nós e serviços conforme as necessidades evoluem[5]. O sistema escala de simples links de dois nós até redes complexas com centenas de nós.

## Primeiros Passos

Para comunidades interessadas no LibreMesh, a progressão típica envolve:

1. **Fase de Planejamento**: Avaliar as necessidades da comunidade e os requisitos técnicos
2. **Seleção de Hardware**: Escolher roteadores e equipamentos adequados (veja [libremesh-installation.md](./libremesh-installation.md))
3. **Design de Rede**: Planejar o posicionamento dos nós e a topologia (veja [mesh-network-basics.md](./mesh-network-basics.md))
4. **Configuração**: Definir os parâmetros básicos da rede e os serviços
5. **Implantação**: Instalar e configurar os nós
6. **Integração Comunitária**: Treinar usuários e estabelecer governança

## Próximos Passos

Esta visão geral fornece a base para compreender os recursos e aplicações do LibreMesh. Para orientações detalhadas de implementação:

- Consulte [mesh-network-basics.md](./mesh-network-basics.md) para conceitos de rede
- Consulte [libremesh-installation.md](./libremesh-installation.md) para procedimentos de hardware e instalação
- Consulte [dns-configuration.md](./dns-configuration.md) para configuração de serviços locais

O LibreMesh representa mais do que apenas tecnologia de rede—é uma ferramenta para o empoderamento comunitário e a autodeterminação digital. Ao fornecer a base técnica para redes controladas pela comunidade, permite que grupos assumam a propriedade de sua infraestrutura digital e criem soluções de conectividade mais resilientes e equitativas.