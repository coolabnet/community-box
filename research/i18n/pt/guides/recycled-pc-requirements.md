---
title: Requisitos de PC Reciclado
sourcePath: guides/recycled-pc-requirements.md
sourceHash: 092186213fa41cde
translatedBy: glm-4.6
---

# Requisitos de Hardware de PCs Reciclados para Servidores Comunitários

## Visão Geral

Este guia estabelece especificações mínimas e recomendadas de hardware para selecionar computadores reciclados adequados para reutilização como servidores comunitários. Estes requisitos equilibram as necessidades de desempenho com as limitações práticas de hardware mais antigo, garantindo ao mesmo tempo confiabilidade para cargas de trabalho de servidor.

## Requisitos Mínimos de Hardware

### Processador (CPU)
- **Mínimo**: Processador 64 bits (arquitetura x86_64)
- **Velocidade de Clock**: 1.4 GHz ou superior
- **Núcleos**: Pelo menos 2 núcleos (4 núcleos recomendados)
- **Geração**: Intel 4ª geração (Haswell) ou equivalente AMD e mais recentes
- **Recursos Necessários**:
  - Suporte ao bit NX e DEP
  - Instruções CMPXCHG16b, LAHF/SAHF e PrefetchW
  - Suporte à virtualização (Intel VT-x ou AMD-V)
  - Second Level Address Translation (EPT ou NPT)

### Memória (RAM)
- **Mínimo Absoluto**: 4 GB DDR3/DDR4
- **Mínimo Recomendado**: 8 GB
- **Ideal**: 16 GB ou mais
- **Tipo**: DDR3-1600 ou DDR4-2400 no mínimo
- **Suporte a ECC**: Preferível, mas não obrigatório

### Armazenamento
- **Unidade de Boot**: Mínimo 120 GB SSD (256 GB recomendado)
- **Armazenamento de Dados**: Mínimo 1 TB HDD para funções de servidor de arquivos
- **Interface**: SATA 3.0 (6 Gbps) preferível
- **Suporte a RAID**: Controlador RAID por hardware preferível para redundância

### Conectividade de Rede
- **Ethernet**: Gigabit Ethernet (1000 Mbps) obrigatório
- **Wi-Fi**: 802.11n no mínimo (802.11ac preferível)
- **Múltiplas NICs**: Benéfico para configurações de rede avançadas

### Fonte de Alimentação
- **Potência**: Mínimo 300W (com certificação de eficiência preferível)
- **Eficiência**: 80 PLUS Bronze ou superior
- **Redundância**: Capacidade de PSU dupla preferível para aplicações críticas

## Especificações Recomendadas de Hardware

### Configuração de Servidor Aprimorada
- **CPU**: Intel i5/i7 6ª geração+ ou AMD Ryzen 3/5/7
- **RAM**: 16-32 GB DDR4
- **Armazenamento**: SSD NVMe de 512 GB + array HDD de 2+ TB
- **Rede**: NICs Gigabit duplas
- **Formato**: Small Form Factor (SFF) ou torre Micro preferível

## Checklist de Seleção de Hardware

### Avaliação Pré-Compra
- [ ] Verificar se a CPU atende aos requisitos de 64 bits
- [ ] Verificar a capacidade máxima de RAM suportada
- [ ] Confirmar o funcionamento das portas Ethernet
- [ ] Testar a funcionalidade de todas as portas USB
- [ ] Inspecionar quanto a danos físicos ou desgaste excessivo
- [ ] Verificar a funcionalidade da fonte de alimentação
- [ ] Verificar a acessibilidade da BIOS/UEFI
- [ ] Confirmar a disponibilidade de slots de expansão

### Verificação de Compatibilidade
- [ ] CPU suporta recursos de virtualização
- [ ] Placa-mãe suporta a configuração de RAM desejada
- [ ] Interfaces de armazenamento compatíveis com as unidades disponíveis
- [ ] Placas de rede suportam as velocidades necessárias
- [ ] Fonte de alimentação atende aos requisitos totais do sistema
- [ ] BIOS/UEFI suporta modos de boot modernos

### Avaliação do Estado Físico
- [ ] Sem danos visíveis nos componentes
- [ ] Componentes internos podem ser limpos
- [ ] Sistema de refrigeração adequado presente
- [ ] Todos os slots de expansão acessíveis
- [ ] Sem sinais de danos por líquidos
- [ ] Acúmulo mínimo de poeira

## Considerações sobre Formato

### Torres Desktop
- **Prós**: Excelente expansibilidade, boa refrigeração, múltiplos baias de unidades
- **Contras**: Ocupação maior, maior consumo de energia
- **Melhor Para**: Servidores de arquivos, servidores de desenvolvimento, armazenamento de alta capacidade

### Small Form Factor (SFF)
- **Prós**: Tamanho compacto, menor consumo de energia, operação silenciosa
- **Contras**: Expansão limitada, menos baias de unidades
- **Melhor Para**: Servidores web, aplicações leves, ambientes com espaço restrito

### Mini/Micro PCs
- **Prós**: Muito compactos, baixo consumo, operação silenciosa
- **Contras**: Expansão muito limitada, frequentemente componentes de laptop
- **Melhor Para**: Serviços básicos, edge computing, ambientes de teste

## Diretrizes de Orçamento

### Faixas Econômicas
- **Servidor Básico**: US$ 100-200 (PCs empresariais mais antigos)
- **Servidor Capacitado**: US$ 200-400 (máquinas empresariais recentes)
- **Servidor de Desempenho**: US$ 400-600 (hardware classe workstation)

### Custo Total de Propriedade
- Considere os potenciais custos de atualização (RAM, armazenamento)
- Considere o consumo de energia ao longo de 3-5 anos
- Considere a disponibilidade de peças de reposição
- Reserve orçamento para materiais de reforma inicial

## Critérios de Exclusão

### Evite Estas Configurações
- Processadores apenas de 32 bits
- Capacidade máxima de RAM inferior a 4 GB
- Somente interfaces de armazenamento IDE/PATA
- Máximo de Ethernet 100 Mbps
- Formatos proprietários com caminhos limitados de atualização
- Sistemas com problemas conhecidos de confiabilidade
- Máquinas que exigem componentes proprietários caros

## Considerações Especiais

### Requisitos de Baixo Consumo
Para operações com eficiência energética:
- Busque sistemas com CPUs de TDP 35W
- Procure fontes 80 PLUS Gold ou superior
- Considere sistemas com refrigeração de estado sólido
- Priorize processadores Intel Atom ou AMD de baixo consumo

### Redundância e Confiabilidade
Para aplicações críticas:
- Prefira sistemas com suporte a RAM ECC
- Procure capacidade de PSU dupla
- Considere suporte a controlador RAID
- Priorize equipamentos empresariais/corporativos

### Planejamento de Escalabilidade
- Escolha sistemas com slots de expansão disponíveis
- Garanta margem adequada na fonte de alimentação
- Verifique os limites máximos de RAM suportada
- Considere capacidade de clusterização para crescimento futuro

## Especificações de Referência Rápida

| Componente | Mínimo | Recomendado | Ideal |
|-----------|---------|-------------|---------|
| CPU | Dual-core 1.4GHz | Quad-core 2.0GHz+ | 6+ núcleos 3.0GHz+ |
| RAM | 4 GB DDR3 | 8 GB DDR4 | 16+ GB DDR4 |
| Armazenamento | 120 GB SSD | 256 GB SSD + 1 TB HDD | 512 GB NVMe + 2+ TB |
| Rede | 100 Mbps | 1 Gbps | Dual 1 Gbps |
| Energia | 300W | 400W 80+ Bronze | 500W+ 80+ Gold |

## Próximos Passos

1. **Consulte**: [Comparação de Modelos Reciclados](recycled-models-comparison.md) para recomendações de modelos específicos
2. **Teste**: Use a [Verificação de Compatibilidade de Hardware](hardware-compatibility-check.md) para validar componentes
3. **Prepare**: Siga a [Preparação de Reciclados](recycled-preparation.md) para a reforma
4. **Configure**: Aplique a configuração de BIOS adequada ao seu hardware específico

---

*Este guia fornece recomendações gerais. Sempre verifique os requisitos específicos de compatibilidade para suas aplicações de servidor e sistema operacional pretendidos.*