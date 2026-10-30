---
title: Comparação de Modelos
sourcePath: hardware/zimaboard/zima-models-comparison.md
sourceHash: 87d91ed29365c634
translatedBy: glm-4.6
---

# Comparação dos Modelos ZimaBoard

## Visão Geral dos Modelos

O ZimaBoard está disponível em três modelos distintos, projetados para atender a diferentes requisitos de desempenho e orçamentos. Todos os modelos compartilham o mesmo formato e capacidades principais de expansão, variando em potência de processamento, memória e configurações de armazenamento[4][9][64].

## Comparação Detalhada de Especificações

| Especificação | ZimaBoard 216 | ZimaBoard 432 | ZimaBoard 832 |
|---------------|---------------|---------------|---------------|
| **CPU** | Intel Celeron N3350<br>Dual Core<br>1.1-2.4GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz |
| **Cache da CPU** | 2MB L2 | 2MB L2 | 2MB L2 |
| **Benchmark da CPU** | ~1158 PassMark | ~1920 PassMark | ~1920 PassMark |
| **Arquitetura** | x86-64 (64 bits) | x86-64 (64 bits) | x86-64 (64 bits) |
| **RAM** | 2GB LPDDR4 (Onboard) | 4GB LPDDR4 (Onboard) | 8GB LPDDR4 (Onboard) |
| **Armazenamento eMMC** | 16GB eMMC 5.1 | 32GB eMMC 5.1 | 32GB eMMC 5.1 |
| **Gráficos** | Intel HD Graphics 500<br>200-650MHz | Intel HD Graphics 500<br>200-700MHz | Intel HD Graphics 500<br>200-700MHz |
| **TDP** | 6W | 6W | 6W |
| **Consumo Típico de Energia** | 2-6W | 3-8W | 4-10W |
| **Preço (USD)** | $119.9 | $159.9 | $199.9 |

## Recursos Compartilhados de Hardware

Todos os modelos do ZimaBoard incluem opções idênticas de conectividade e expansão:

### Conectividade
- **Ethernet**: 2x Gigabit Ethernet (Realtek 8111H)
- **USB**: 2x portas USB 3.0
- **Display**: 1x Mini-DisplayPort 1.2 (suporte a 4K@60Hz)
- **Energia**: Entrada DC 12V/3A (conector P4)

### Expansão de Armazenamento
- **SATA**: 2x portas SATA 6.0 Gb/s
- **PCIe**: 1x slot PCIe 2.0 x4 (externo)
- **Armazenamento Máximo**: Até 36TB via discos SATA

### Recursos Adicionais
- **Refrigeração**: Design de dissipador passivo (sem ventoinha)
- **Segurança de Hardware**: Suporte a Intel VT-d, VT-x, AES-NI
- **Codecs de Vídeo**: H.264 (AVC), H.265 (HEVC), MPEG-2, VC-1
- **Dimensões**: 138.7 x 81.4 x 34.9 mm (L x P x A)
- **Peso**: 278g

## Análise de Desempenho

### ZimaBoard 216 (Nível de Entrada)
**Casos de Uso Alvo:**
- Roteador/firewall doméstico básico (pfSense, OpenWrt)
- Servidor de arquivos simples ou NAS leve
- Gateway IoT ou dispositivo de borda
- Ambiente de desenvolvimento e testes

**Características de Desempenho:**
- CPU dual-core adequada para multitarefa básica
- 2GB de RAM suficiente para serviços leves
- Capacidades limitadas de transcodificação (1-2 streams 1080p)
- Adequado para redes pequenas (1-5 usuários)

**Limitações:**
- Pode ter dificuldades com aplicativos que exigem muita memória
- Suporte limitado a usuários simultâneos
- Desempenho básico de transcodificação

### ZimaBoard 432 (Equilibrado)
**Casos de Uso Alvo:**
- Servidor de mídia doméstico (Plex/Jellyfin com transcodificação leve)
- Home lab com múltiplos serviços
- Roteador de pequeno escritório com serviços adicionais
- Host de contêineres Docker (5-10 contêineres)

**Características de Desempenho:**
- CPU quad-core oferece boa multitarefa
- 4GB de RAM adequados para cargas de trabalho moderadas
- Suporta 2-3 streams de transcodificação simultâneos
- Bom equilíbrio entre desempenho e custo

**Ponto Ideal Para:**
- A maioria dos usuários de home lab
- Ambientes com cargas de trabalho mistas
- Usuários que desejam espaço para crescimento

### ZimaBoard 832 (Desempenho)
**Casos de Uso Alvo:**
- Servidor de mídia de alto desempenho (múltiplos streams 4K)
- Host de virtualização (Proxmox, ESXi)
- Aparelho de rede com múltiplas VMs
- Servidor de desenvolvimento com múltiplos serviços

**Características de Desempenho:**
- Mesma CPU do 432, mas com RAM máxima
- 8GB de RAM habilitam virtualização e aplicativos que exigem muita memória
- Suporta 3-4 streams de transcodificação simultâneos
- Melhor desempenho para ambientes multiusuário

**Ideal Para:**
- Usuários avançados e entusiastas
- Ambientes de virtualização
- Servidores de mídia multiusuário
- Serviços domésticos de nível de produção

## Tamanhos de Implantação Alvo

### ZimaBoard 216
- **Tamanho da Rede**: 1-3 dispositivos
- **Usuários Simultâneos**: 1-2 usuários
- **Necessidades de Armazenamento**: Compartilhamento básico de arquivos
- **Serviços**: 2-3 contêineres leves
- **Orçamento**: Investimento de nível de entrada

### ZimaBoard 432
- **Tamanho da Rede**: 5-15 dispositivos
- **Usuários Simultâneos**: 2-5 usuários
- **Necessidades de Armazenamento**: Biblioteca de mídia doméstica
- **Serviços**: 5-8 contêineres moderados
- **Orçamento**: Investimento intermediário

### ZimaBoard 832
- **Tamanho da Rede**: 10-25 dispositivos
- **Usuários Simultâneos**: 3-8 usuários
- **Necessidades de Armazenamento**: Grandes coleções de mídia
- **Serviços**: 8-15 contêineres ou VMs
- **Orçamento**: Investimento focado em desempenho

## Análise de Consumo de Energia

| Modelo | Consumo em Repouso | Carga Leve | Carga Pesada | Máximo |
|-------|------------|------------|------------|---------|
| 216 | 2.5W | 4W | 6W | 8W |
| 432 | 3W | 5W | 8W | 10W |
| 832 | 3.5W | 6W | 10W | 15W |

**Observação**: O consumo de energia varia significativamente com base em:
- Dispositivos de armazenamento conectados
- Uso de placas PCIe
- Tráfego de rede
- Utilização da CPU
- Temperatura ambiente

## Recomendações de Memória e Armazenamento

### ZimaBoard 216
- **Adequado Para**: Serviços leves, roteamento básico
- **Uso de RAM**: Tipicamente 60-80% sob carga normal
- **Estratégia de Armazenamento**: Usar eMMC para o sistema operacional, um único disco SATA para dados
- **Prioridade de Expansão**: Focar em armazenamento em vez de desempenho

### ZimaBoard 432
- **Adequado Para**: Funções equilibradas de servidor doméstico
- **Uso de RAM**: Tipicamente 50-70% sob carga normal
- **Estratégia de Armazenamento**: eMMC para o sistema operacional, SATA duplo para RAID/expansão
- **Prioridade de Expansão**: Aprimoramentos de armazenamento e rede

### ZimaBoard 832
- **Adequado Para**: Alto desempenho e virtualização
- **Uso de RAM**: Tipicamente 40-60% sob carga normal
- **Estratégia de Armazenamento**: PCIe NVMe para sistema operacional/VMs, SATA para armazenamento em massa
- **Prioridade de Expansão**: Armazenamento e rede de alta velocidade

## Escolhendo o Modelo Certo

### Escolha o ZimaBoard 216 Se:
- O orçamento é a principal preocupação ($119.9)
- Requisitos básicos de rede/roteamento
- Ambiente de usuário único
- Foco em aprendizado e experimentação
- O consumo de energia é crítico

### Escolha o ZimaBoard 432 Se:
- Requisitos equilibrados de desempenho e custo ($159.9)
- Servidor de mídia doméstico com transcodificação leve
- Ambiente familiar ou de pequeno escritório
- Necessidade de espaço para expansão de serviços
- Desejo pela opção mais versátil

### Escolha o ZimaBoard 832 Se:
- Desempenho máximo dentro da linha ZimaBoard ($199.9)
- Virtualização ou múltiplas VMs planejadas
- Necessidade de servidor de mídia de alto desempenho
- Ambiente multiusuário (3+ usuários simultâneos)
- Desejo de investimento preparado para o futuro

## Análise Competitiva

| Dispositivo | ZimaBoard 832 | Synology DS218+ | Intel NUC Kit | Raspberry Pi 4 8GB |
|--------|---------------|-----------------|---------------|-------------------|
| CPU | N3450 4-core | J3355 2-core | Varia | ARM Cortex-A72 |
| RAM | 8GB | 2GB | Varia | 8GB |
| Armazenamento | 32GB + 2x SATA | 2 baias | Varia | microSD |
| Preço | $199.9 | $299 | $300-500 | $75 |
| Expansão | PCIe + SATA | Limitada | Boa | Focada em GPIO |

## Caminhos de Migração e Atualização

### Do ZimaBoard 216:
- **Para o 432**: Vale a pena pelo aumento de RAM e desempenho
- **Para o 832**: Atualização significativa para necessidades de virtualização
- **Migração de Dados**: Transferência simples de discos entre unidades

### Do ZimaBoard 432:
- **Para o 832**: Recomendado para cargas de trabalho que exigem muita memória
- **Alternativa**: Adicionar placas de expansão PCIe para melhorar o desempenho

### Atualizações Externas:
- **Armazenamento**: Controladores PCIe SATA para discos adicionais
- **Rede**: Placas de rede PCIe para 10GbE ou portas adicionais
- **Computação**: Placas aceleradoras PCIe para cargas de trabalho específicas

## Documentação Relacionada

- Para opções detalhadas de expansão: [zima-expansion-options.md](zima-expansion-options.md)
- Para configuração e instalação: [zima-overview.md](zima-overview.md)
- Para solução de problemas: [zima-troubleshooting.md](zima-troubleshooting.md)

## Recomendações da Comunidade

Com base no feedback da comunidade e implantações reais[55][17][34]:

- **Mais Popular**: O ZimaBoard 432 oferece a melhor relação custo-benefício
- **Melhor Investimento**: ZimaBoard 832 para uso de longo prazo e expansibilidade
- **Escolha Econômica**: ZimaBoard 216 para aprendizado e aplicações básicas
- **Uso Profissional**: Considere o ZimaBoard 832 com placas de expansão de nível empresarial