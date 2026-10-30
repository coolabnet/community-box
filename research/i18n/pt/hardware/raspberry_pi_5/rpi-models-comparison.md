---
title: Comparação de Modelos
sourcePath: hardware/raspberry_pi_5/rpi-models-comparison.md
sourceHash: 44536687c7114dc1
translatedBy: glm-4.6
---

# Comparação de Modelos de Raspberry Pi para Servidores Comunitários

## Introdução

Escolher o modelo correto de Raspberry Pi é crucial para uma implantação bem-sucedida de servidor comunitário. Esta comparação abrangente cobre os modelos mais populares adequados para aplicações de servidor, focando em especificações, características de desempenho e melhores casos de uso para plataformas comunitárias como YunoHost, CasaOS e CapRover.

## Comparação de Especificações dos Modelos

### Tabela de Especificações Principais

| Característica | Raspberry Pi 3B+ | Raspberry Pi 4 Model B | Raspberry Pi 5 |
|---------|------------------|------------------------|----------------|
| **Processador** | Quad-core ARM Cortex-A53 | Quad-core ARM Cortex-A72 | Quad-core ARM Cortex-A76 |
| **Velocidade de Clock** | 1.4 GHz | 1.8 GHz | 2.4 GHz |
| **Arquitetura** | ARMv8 (64 bits) | ARMv8 (64 bits) | ARMv8 (64 bits) |
| **Opções de RAM** | 1GB LPDDR2 | 1GB, 2GB, 4GB, 8GB LPDDR4-3200 | 2GB, 4GB, 8GB LPDDR4X-4267 |
| **GPU** | VideoCore IV @ 400MHz | VideoCore VI @ 500MHz | VideoCore VII @ 800MHz |
| **Interface de Armazenamento** | microSD (50MB/s máx) | microSD + boot via USB 3.0 | microSD + USB 3.0 + PCIe 2.0 |
| **Portas USB** | 4× USB 2.0 | 2× USB 2.0, 2× USB 3.0 | 2× USB 2.0, 2× USB 3.0 |
| **Ethernet** | Gigabit (300Mbps real) | Gigabit (velocidade total) | Gigabit (velocidade total) |
| **WiFi** | 802.11ac de banda dupla | 802.11ac de banda dupla | 802.11ac de banda dupla |
| **Bluetooth** | 4.2 | 5.0 | 5.0 |
| **Requisitos de Energia** | 5V/2.5A micro-USB | 5V/3A USB-C | 5V/5A USB-C |
| **Consumo de Energia (Em Repouso)** | 1.4W | 2.7W | 3.3W |
| **Consumo de Energia (Sob Carga)** | 3.7W | 6.4W | 8.0W |
| **HDMI** | 1× tamanho completo | 2× micro-HDMI (4K60) | 2× micro-HDMI (4K60) |
| **GPIO** | Conector de 40 pinos | Conector de 40 pinos | Conector de 40 pinos |
| **Data de Lançamento** | Março de 2018 | Junho de 2019 | Outubro de 2023 |
| **Preço Típico** | $35 | $35-75 | $60-80 |

### Benchmarks de Desempenho

| Benchmark | Raspberry Pi 3B+ | Raspberry Pi 4 (4GB) | Raspberry Pi 5 (4GB) |
|-----------|------------------|----------------------|---------------------|
| **Sysbench CPU (events/sec)** | ~1,800 | ~2,800 | ~4,200 |
| **Largura de Banda de Memória** | ~4,000 MB/s | ~6,000 MB/s | ~30,000 MB/s |
| **Velocidade de Leitura do Cartão SD** | ~22 MB/s | ~46 MB/s | ~90 MB/s |
| **Velocidade de SSD USB 3.0** | N/A | ~350 MB/s | ~400 MB/s |
| **Tempo de Boot (Raspbian)** | ~45 segundos | ~25 segundos | ~18 segundos |
| **Inicialização de Contêiner Docker** | Lenta | Moderada | Rápida |

*Os benchmarks são aproximados e podem variar dependendo das configurações específicas e cargas de trabalho[1][2][3]*

## Compatibilidade com Plataformas Comunitárias

### Requisitos e Desempenho do YunoHost

| Modelo | RAM Mínima | RAM Recomendada | Avaliação de Desempenho | Observações |
|-------|-------------|-----------------|-------------------|-------|
| **Pi 3B+** | 1GB | 1GB | ⭐⭐⭐ | Funciona, mas com aplicativos simultâneos limitados |
| **Pi 4 2GB** | 1GB | 2GB | ⭐⭐⭐⭐ | Bom para serviços comunitários básicos |
| **Pi 4 4GB** | 1GB | 4GB | ⭐⭐⭐⭐⭐ | Recomendado para a maioria das implantações |
| **Pi 4 8GB** | 1GB | 8GB | ⭐⭐⭐⭐⭐ | Excelente para vários aplicativos pesados |
| **Pi 5 4GB** | 1GB | 4GB | ⭐⭐⭐⭐⭐ | Desempenho superior, resposta rápida |
| **Pi 5 8GB** | 1GB | 8GB | ⭐⭐⭐⭐⭐ | Plataforma de servidor comunitário de alto nível |

**Observações Específicas do YunoHost:**
- Suporta Pi 3, 4 e 5 com imagens oficiais[11][14]
- microSD de 16GB no mínimo, Classe A1 recomendada[11]
- Conexão Ethernet fortemente recomendada
- Pode ser instalado via gravação direta de imagem ou instalação base Debian[12]

### Compatibilidade com CasaOS

| Modelo | Nível de Suporte | Desempenho de Contêineres | Uso Recomendado |
|-------|---------------|----------------------|-----------------|
| **Pi 3B+** | ✅ Suportado | Limitado | Apenas desenvolvimento/testes |
| **Pi 4 2GB** | ✅ Totalmente Suportado | Bom | Cargas de trabalho leves de contêineres |
| **Pi 4 4GB+** | ✅ Totalmente Suportado | Excelente | Implantações de produção |
| **Pi 5 Todos os Modelos** | ✅ Totalmente Suportado | Superior | Implantações de alto desempenho |

**Requisitos Específicos do CasaOS:**
- Compatível com Raspberry Pi OS[17][22]
- Suporte a Docker essencial
- Mínimo de 2GB de RAM recomendado para operação fluida
- Armazenamento SSD altamente recomendado para volumes Docker

### Suporte à Arquitetura ARM do CapRover

| Modelo | Arquitetura ARM | Suporte a Docker | Desempenho de Build | Pronto para Produção |
|-------|------------------|----------------|-------------------|------------------|
| **Pi 3B+** | ARMv8 (64 bits) | ✅ Sim | Lento | Limitado |
| **Pi 4 Todos os Modelos** | ARMv8 (64 bits) | ✅ Sim | Bom | ✅ Sim |
| **Pi 5 Todos os Modelos** | ARMv8 (64 bits) | ✅ Sim | Excelente | ✅ Sim |

**Observações Específicas do CapRover:**
- Suporte oficial a ARM64 e ARMv7[52][55]
- Mínimo de 1GB de RAM, mas 2GB+ fortemente recomendado[52]
- Alguns aplicativos de um clique podem não ter versões ARM[55]
- Builds de contêineres Docker podem exigir muitos recursos

## Opções de Armazenamento e Desempenho

### Desempenho do Cartão SD por Modelo

| Modelo | Interface do Cartão SD | Velocidade Máxima | Suporte a A1/A2 | Desempenho de Boot |
|-------|-------------------|---------------|---------------|------------------|
| **Pi 3B+** | SDR50 | ~25 MB/s | Apenas A1 | Moderado |
| **Pi 4** | DDR50 | ~46 MB/s | A1/A2 | Bom |
| **Pi 5** | SDR104 | ~90 MB/s | Otimizado para A1/A2 | Excelente |

### Opções Alternativas de Armazenamento

| Tipo de Armazenamento | Pi 3B+ | Pi 4 | Pi 5 | Melhor Caso de Uso |
|--------------|---------|------|------|---------------|
| **Apenas microSD** | ✅ | ✅ | ✅ | Desenvolvimento, testes |
| **SSD USB 3.0** | ❌ | ✅ | ✅ | Servidores de produção |
| **SSD NVMe PCIe** | ❌ | ❌ | ✅ | Servidores de alto desempenho |
| **Boot pela Rede** | Limitado | ✅ | ✅ | Gerenciamento centralizado |

**Recomendações de Armazenamento:**
- **Desenvolvimento**: microSD Classe A1 (32GB+)
- **Produção**: SSD USB 3.0 (120GB+) para Pi 4/5[44][47]
- **Alto Desempenho**: SSD NVMe PCIe para Pi 5
- **Confiabilidade**: Evite microSD para armazenamento de dados de produção[42][43]

## Considerações Específicas de cada Modelo

### Observações Específicas do Raspberry Pi 3B+

**Pontos Fortes:**
- Menor consumo de energia (~1.4W em repouso)[23]
- Estabilidade comprovada com plataformas comunitárias
- Mais acessível que modelos mais recentes
- Bom para aprendizado e desenvolvimento

**Limitações:**
- Gargalos de desempenho em thread única
- RAM limitada (máximo de 1GB)
- Sem suporte a USB 3.0
- Interface de cartão SD mais lenta

**Melhores Casos de Uso:**
- Servidores DNS/DHCP
- Compartilhamento básico de arquivos
- Ambientes de aprendizado
- Serviços web de baixo tráfego

### Observações Específicas do Raspberry Pi 4

**Variantes do Model B:**
- **1GB**: Apenas serviços básicos, não recomendado para plataformas comunitárias
- **2GB**: Adequado para implantações leves de YunoHost/CasaOS
- **4GB**: Ponto ideal para a maioria das aplicações de servidor comunitário
- **8GB**: Ideal para vários serviços simultâneos ou aplicações pesadas

**Características Principais:**
- Suporte a boot via USB 3.0 para armazenamento SSD[49][51]
- Capacidade de saída para dois monitores 4K
- Ethernet Gigabit verdadeira (sem compartilhamento de banda USB)
- Ecossistema maduro com documentação extensa

**Considerações Térmicas:**
- Requer refrigeração ativa sob carga sustentada[38]
- Limitação térmica (thermal throttling) a 80-85°C[6]
- A escolha do gabinete impacta significativamente o desempenho

### Observações Específicas do Raspberry Pi 5

**Recursos Avançados:**
- Slot PCIe 2.0 para conexão direta de SSD NVMe
- Botão físico de energia e gerenciamento de energia aprimorado
- Controlador de E/S aprimorado (RP1) para melhores periféricos
- Subsistema de memória mais rápido (DDR4X)

**Melhorias de Desempenho:**
- 2-3x mais rápido que o Pi 4 na maioria dos benchmarks[1][2]
- Desempenho de cartão SD e USB significativamente melhorado
- Melhor design térmico com refrigeração ativa opcional[31]

**Considerações:**
- Maior consumo de energia (requer fonte de 5A)
- Mais caro que as gerações anteriores
- Alguns acessórios podem precisar de atualizações para compatibilidade
- Alocação de memória da GPU gerenciada automaticamente (sem necessidade de divisão manual)[67]

## Comparação de Desempenho de Rede

| Modelo | Taxa de Transferência Ethernet | Desempenho WiFi | Conexões Simultâneas |
|-------|-------------------|------------------|----------------------|
| **Pi 3B+** | ~300 Mbps | Bom (banda compartilhada) | Limitado |
| **Pi 4** | ~940 Mbps | Excelente (dedicado) | Muito Bom |
| **Pi 5** | ~940 Mbps | Excelente (aprimorado) | Excelente |
## Configurações Recomendadas por Caso de Uso

### Servidor Doméstico Básico (DNS, Compartilhamento de Arquivos)
- **Mínimo**: Pi 3B+ com microSD A1 de 32GB
- **Recomendado**: Pi 4 2GB com SSD USB
- **Ótimo**: Pi 5 4GB com SSD NVMe PCIe

### Host de Plataforma Comunitária (YunoHost, CasaOS)
- **Mínimo**: Pi 4 4GB com microSD A2 de 64GB + SSD USB
- **Recomendado**: Pi 4 8GB com boot via SSD USB 3.0
- **Ótimo**: Pi 5 8GB com SSD NVMe PCIe

### Ambiente de Desenvolvimento e Testes
- **Econômico**: Pi 3B+ com microSD de 32GB
- **Versátil**: Pi 4 4GB com microSD + SSD USB
- **Desempenho**: Pi 5 4GB com armazenamento rápido

### Servidor Comunitário Multisserviços
- **Inicial**: Pi 4 8GB com SSD USB e refrigeração ativa
- **Profissional**: Pi 5 8GB com SSD NVMe e cooler oficial
- **Cluster**: Múltiplas unidades Pi 4/5 com armazenamento centralizado

## Caminhos de Migração e Atualização

### De Pi 3B+ para Pi 4
- **Benefícios**: Melhoria de desempenho de 2-4x, USB 3.0, mais opções de RAM
- **Considerações**: Maiores requisitos de energia, necessidade de fonte USB-C
- **Armazenamento**: Pode reutilizar o microSD, mas SSD USB é altamente recomendado

### De Pi 4 para Pi 5
- **Benefícios**: Melhoria de desempenho de 2-3x, armazenamento PCIe, E/S melhorada
- **Considerações**: Maior consumo de energia (fonte de 5A), compatibilidade de acessórios
- **Armazenamento**: Suporte direto a SSD NVMe elimina gargalos do USB

## Análise Custo-Benefício

### Custo Total de Propriedade (Estimativa de 2 Anos)

| Componente | Pi 3B+ | Pi 4 4GB | Pi 5 4GB |
|-----------|---------|----------|----------|
| **Placa** | $35 | $55 | $75 |
| **Fonte de Alimentação** | $10 | $15 | $20 |
| **Armazenamento** | $15 (microSD) | $35 (SSD) | $50 (NVMe) |
| **Refrigeração** | $10 | $15 | $25 |
| **Gabinete** | $10 | $15 | $20 |
| **Eletricidade (24/7)** | $25 | $40 | $50 |
| **Custo Total de 2 Anos** | $105 | $175 | $240 |

### Desempenho Por Dólar

| Modelo | Pontuação de Desempenho | Custo de 2 Anos | Desempenho/$ |
|-------|------------------|-------------|---------------|
| **Pi 3B+** | 100 | $105 | 0.95 |
| **Pi 4 4GB** | 280 | $175 | 1.60 |
| **Pi 5 4GB** | 420 | $240 | 1.75 |

*Pontuação de desempenho baseada no desempenho relativo de benchmarks nas métricas de CPU, memória e armazenamento*

## Resumo e Recomendações

### Guia de Decisão Rápida

**Escolha Pi 3B+ se:**
- Orçamento é a principal preocupação (<$50 no total)
- Consumo de energia é crítico (solar/bateria)
- Ambiente de aprendizado/desenvolvimento
- Cargas de trabalho de servidor muito leves

**Escolha Pi 4 4GB se:**
- Desempenho e custo equilibrados
- Compatibilidade comprovada com plataformas comunitárias
- Precisa de armazenamento SSD USB 3.0
- Implantação multisserviços moderada

**Escolha Pi 4 8GB se:**
- Execução de múltiplos aplicativos pesados
- Cargas de trabalho intensivas em banco de dados
- Uso intenso de contêineres
- Investimento à prova de futuro

**Escolha Pi 5 4GB/8GB se:**
- Desempenho máximo exigido
- Armazenamento SSD NVMe necessário
- Recursos e conectividade mais recentes
- Implantação de produção de longo prazo

### Recomendações Específicas para Plataformas Comunitárias

- **YunoHost**: Pi 4 4GB no mínimo, Pi 5 4GB como ideal
- **CasaOS**: Pi 4 4GB recomendado, Pi 5 para desempenho
- **CapRover**: Pi 4 8GB para múltiplos aplicativos, Pi 5 para velocidade de desenvolvimento

---

*Para requisitos detalhados de energia e refrigeração, consulte [rpi-cooling-power.md](rpi-cooling-power.md).*