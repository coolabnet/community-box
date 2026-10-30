---
title: Comparação de Modelos
sourcePath: hardware/intel_nuc/nuc-models-comparison.md
sourceHash: 30aecd86774014b3
translatedBy: glm-4.6
---

# Comparação de Modelos Intel NUC para Implantação de Servidor

## Visão Geral

Esta comparação abrangente aborda os modelos Intel NUC adequados para implantação de servidores comunitários, com foco nas especificações relevantes para plataformas de self-hosting como YunoHost, Caprover e CasaOS.

## Modelos da Geração Atual (2024-2025)

### Modelos ASUS NUC (13ª Geração)

| Modelo | CPU | Núcleos/Threads | Base/Boost GHz | TDP | RAM Máx. | Armazenamento | Rede | Faixa de Preço |
|--------|-----|-----------------|----------------|-----|----------|---------------|------|----------------|
| **NUC13ANHi3** | i3-1315U | 6 (2P+4E) / 8 | 1.2/4.5 | 15W | 64GB | M.2 + 2.5" | 2.5GbE | $300-400 |
| **NUC13ANHi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $450-550 |
| **NUC13ANHi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $600-700 |
| **NUC13ANKi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | 2x M.2 | 2.5GbE | $490-590 |
| **NUC13ANKi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | 2x M.2 | 2.5GbE | $650-750 |

### Modelos ASUS ROG NUC para Games (2025)

| Modelo | CPU | GPU | Núcleos/Threads | TDP | RAM Máx. | Armazenamento | Rede | Faixa de Preço |
|--------|-----|-----|-----------------|-----|----------|---------------|------|----------------|
| **ROG NUC 2025** | Core Ultra 9 275HX | RTX 5080 Mobile | 24 (8P+16E) / 32 | 160W | 96GB | 2x M.2 | 2.5GbE | $3000+ |

### Modelos Legados da Intel (12ª Geração)

| Modelo | CPU | Núcleos/Threads | Base/Boost GHz | TDP | RAM Máx. | Armazenamento | Rede | Status |
|--------|-----|-----------------|----------------|-----|----------|---------------|------|--------|
| **NUC12WSHi3** | i3-1220P | 10 (2P+8E) / 12 | 1.1/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |
| **NUC12WSHi5** | i5-1240P | 12 (4P+8E) / 16 | 1.7/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |
| **NUC12WSHi7** | i7-1260P | 12 (4P+8E) / 16 | 2.1/4.7 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |

## Comparação Detalhada de Especificações

### Características de Desempenho

| Modelo | Pontuação Passmark CPU* | Gráficos | Linhas PCIe | Thunderbolt | Portas USB | Consumo de Energia |
|--------|-------------------------|----------|-------------|-------------|------------|--------------------|
| **NUC13ANHi3** | ~12,000 | Intel UHD | 16 | TB4 (2x) | 6x USB 3.2 | 15W ocioso, 35W em carga |
| **NUC13ANHi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W ocioso, 45W em carga |
| **NUC13ANHi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W ocioso, 50W em carga |
| **NUC13ANKi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W ocioso, 45W em carga |
| **NUC13ANKi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W ocioso, 50W em carga |
| **ROG NUC 2025** | ~35,000+ | RTX 5080 | 20 | TB4 (1x) | 7x USB 3.2 | 25W ocioso, 160W em carga |

*Pontuações aproximadas - o desempenho real pode variar

### Detalhes de Memória e Armazenamento

| Modelo | Tipo de RAM | Capacidade Máx. | Slots de RAM | Slots de Armazenamento | Armazenamento Máx. | Opções de Boot |
|--------|-------------|-----------------|--------------|------------------------|--------------------|----------------|
| **NUC13ANHi3** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi5** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi7** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANKi5** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB no total | UEFI, Legacy |
| **NUC13ANKi7** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB no total | UEFI, Legacy |
| **ROG NUC 2025** | DDR5-5600 SO-DIMM | 96GB | 2x | 2x M.2 | 8TB no total | Apenas UEFI |

### Conectividade e I/O

| Modelo | Ethernet | WiFi | Bluetooth | Saídas de Vídeo | Áudio | Dimensões (mm) |
|--------|----------|------|-----------|------------------|-------|-----------------|
| **NUC13ANHi3** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANKi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **NUC13ANKi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **ROG NUC 2025** | 2.5GbE | WiFi 7 | BT 5.4 | 2x DP2.1, 2x HDMI2.1 | 3.5mm | 282×188×57 |

## Matriz de Compatibilidade com Plataformas de Servidor

### Suporte a Sistemas Operacionais

| Modelo | Ubuntu Server | Debian | CentOS/RHEL | Windows Server | Proxmox | ESXi |
|--------|---------------|--------|-------------|----------------|---------|------|
| **NUC13ANHi3** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver necessário | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver necessário | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver necessário | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver necessário | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver necessário | ✅ 7.4+ | ✅ 7.0+ |
| **ROG NUC 2025** | ✅ 22.04+ | ✅ 12+ | ✅ 9+ | ❌ Não recomendado | ✅ 8.0+ | ✅ 8.0+ |

### Suporte a Plataformas Comunitárias

| Modelo | YunoHost | CasaOS | Caprover | Home Assistant | Nextcloud | Docker |
|--------|----------|--------|----------|----------------|-----------|--------|
| **NUC13ANHi3** | ✅ Bom | ✅ Excelente | ✅ Bom | ✅ Excelente | ✅ Bom | ✅ Excelente |
| **NUC13ANHi5** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANHi7** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANKi5** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANKi7** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **ROG NUC 2025** | ⚠️ Exagerado | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |

## Configurações Recomendadas por Caso de Uso

### Servidor Doméstico Iniciante (Uso Leve)
**Recomendado: NUC13ANHi3**
- **RAM**: 16GB (2x 8GB DDR4-3200)
- **Armazenamento**: SSD NVMe de 500GB + SSD SATA de 2TB
- **Casos de Uso**: Compartilhamento de arquivos, streaming básico de mídia, nuvem pessoal
- **Custo Estimado**: $400-500 (barebones + componentes)

### Servidor Doméstico Equilibrado (Uso Médio)
**Recomendado: NUC13ANHi5 ou NUC13ANKi5**
- **RAM**: 32GB (2x 16GB DDR4-3200)
- **Armazenamento**: SSD NVMe de 1TB + SSD SATA de 4TB (ANHi5) ou 2x NVMe de 2TB (ANKi5)
- **Casos de Uso**: Múltiplos serviços, workloads em contêineres, desenvolvimento
- **Custo Estimado**: $600-800 (barebones + componentes)

### Servidor de Alto Desempenho (Uso Intenso)
**Recomendado: NUC13ANHi7 ou NUC13ANKi7**
- **RAM**: 64GB (2x 32GB DDR4-3200)
- **Armazenamento**: SSD NVMe de 2TB + SSD SATA de 4TB
- **Casos de Uso**: Virtualização, múltiplas VMs, workloads intensivos
- **Custo Estimado**: $900-1200 (barebones + componentes)

### Servidor para Games/Entusiastas
**Recomendado: ROG NUC 2025**
- **RAM**: 64-96GB DDR5
- **Armazenamento**: 2x SSD NVMe de 4TB
- **Casos de Uso**: Servidores de jogos, computação com GPU, workloads de IA
- **Custo Estimado**: $3500+ (sistema completo)

## Árvore de Decisão para Seleção de Modelo

```
Do you need GPU acceleration or gaming performance?
├─ YES → ROG NUC 2025
└─ NO → Continue

Is maximum storage flexibility important?
├─ YES → NUC13ANKi5/i7 (dual M.2, no 2.5" bay)
└─ NO → Continue

What's your performance requirement?
├─ Basic (file sharing, simple services) → NUC13ANHi3
├─ Medium (containers, multiple services) → NUC13ANHi5
└─ High (virtualization, heavy workloads) → NUC13ANHi7
```

## Comparação de Eficiência Energética

| Modelo | Consumo em Repouso | Carga Típica | Consumo Máx. | Custo Anual Estimado* |
|--------|--------------------|--------------|--------------|-----------------------|
| **NUC13ANHi3** | 5-8W | 15-25W | 35W | $15-30 |
| **NUC13ANHi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANHi7** | 8-12W | 25-40W | 50W | $25-45 |
| **NUC13ANKi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANKi7** | 8-12W | 25-40W | 50W | $25-45 |
| **ROG NUC 2025** | 20-30W | 80-120W | 160W | $80-130 |

*Baseado em $0.12/kWh, operação 24/7
## Capacidades de Atualização e Expansão

### Atualizações de Memória
- **Todos os Modelos Padrão**: Suporte até 64GB DDR4-3200 SO-DIMM
- **ROG NUC**: Suporta até 96GB DDR5-5600 SO-DIMM
- **Instalação**: Acesso sem ferramentas na maioria dos modelos

### Expansão de Armazenamento
- **Modelos ANH**: 1x M.2 2280 + 1x baia SATA de 2.5"
- **Modelos ANK**: 2x slots M.2 2280 (sem baia de 2.5")
- **ROG NUC**: 2x slots M.2 2280 + refrigeração avançada

### Expansão de Conectividade
- **Thunderbolt 4**: Suporta GPU externa, armazenamento, rede
- **USB 3.2**: Múltiplas portas para periféricos adicionais
- **Rede**: Adaptadores USB-to-Ethernet para NICs adicionais

## Considerações sobre Modelos Antigos

### Quando Considerar Modelos Mais Antigos
- **Restrições de orçamento**: Modelos NUC11/12 oferecem bom custo-benefício
- **Compatibilidade específica**: Alguns softwares funcionam melhor com hardware mais antigo
- **Inventário disponível**: Modelos antigos podem estar com desconto

### Caminho de Migração
- Comece com a geração atual para maior longevidade
- Considere o caminho de atualização ao planejar a configuração inicial
- Leve em conta o cronograma de suporte a drivers

## Recomendações de Compra

### Onde Comprar
- **ASUS Direct**: Modelos mais recentes, garantia completa
- **Integradores de Sistemas**: Opções pré-configuradas
- **Grandes Varejistas**: Preços competitivos, políticas de devolução
- **Mercado Usado**: Modelos antigos a preços reduzidos

### O que Evitar
- **Modelos muito antigos** (NUC6 e anteriores): Suporte limitado a sistemas operacionais modernos
- **Vendedores desconhecidos**: Preocupações com garantia e suporte
- **Kits incompletos**: Verifique se todos os componentes necessários estão incluídos

---

**Próximos Passos:**
- Consulte [nuc-bios-setup.md](nuc-bios-setup.md) para diretrizes de configuração
- Verifique [nuc-power-network.md](nuc-power-network.md) para melhores práticas de configuração

*Especificações sujeitas a alterações. Sempre verifique a documentação do fabricante antes da compra.*