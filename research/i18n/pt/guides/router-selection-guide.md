---
title: Seleção de Roteador
sourcePath: guides/router-selection-guide.md
sourceHash: 561fe8f7603030d2
translatedBy: glm-4.6
---

# Guia de Seleção de Roteadores para Redes Comunitárias LibreMesh

Este guia ajuda você a avaliar e selecionar roteadores compatíveis e confiáveis para a instalação do firmware LibreMesh e para fins de redes comunitárias. Fazer a escolha certa de hardware é crucial para uma implantação bem-sucedida de uma rede comunitária.

## Matriz de Decisão Rápida

Antes de mergulhar nas especificações detalhadas, use esta matriz para determinar rapidamente se um roteador é adequado para sua implantação LibreMesh:

| Requisito | Mínimo | Recomendado | Ideal |
|-------------|---------|-------------|-------|
| Memória Flash | 8 MB | 16 MB | 32+ MB |
| RAM | 64 MB | 128 MB | 256+ MB |
| Rádios | 1 (2.4 GHz) | 2 (2.4 + 5 GHz) | 3+ (Múltiplos 5 GHz) |
| Portas Ethernet | 1 LAN | 4 LAN + 1 WAN | 5+ Gigabit |
| Chipset | Qualquer suportado pelo OpenWrt | Atheros/MediaTek | Atheros ath9k/ath10k |

## Análise Profunda dos Requisitos de Hardware

### Especificações de Memória

**Memória Flash (Armazenamento)**
- **8 MB mínimo**: Permite instalação básica do LibreMesh com firmware `-mini`
- **16 MB recomendado**: LibreMesh padrão com conjunto completo de recursos
- **32+ MB ideal**: Permite pacotes adicionais, logs extensivos e atualizações futuras

**RAM (Memória do Sistema)**
- **64 MB mínimo**: Operação básica de mesh com conexões simultâneas limitadas
- **128 MB recomendado**: Desempenho estável com 20-50 dispositivos
- **256+ MB ideal**: Nós de alta capacidade suportando 100+ dispositivos e recursos avançados

> **💡 Dica**: Procure o rótulo de especificações na parte inferior ou traseira do roteador. As especificações de memória frequentemente são listadas como "Flash: XXX MB" e "RAM: XXX MB".

### Requisitos de Rádio Sem Fio

**Configuração Essencial de Rádios**
- **Rádio 2.4 GHz**: Necessário para acesso de clientes e backhaul mesh
- **Rádio 5 GHz**: Fortemente recomendado para backhaul mesh de alta velocidade
- **Múltiplos rádios 5 GHz**: Ideal para separação dedicada entre backhaul e acesso de clientes

**Chipsets Suportados (Ordem de Prioridade)**
1. **Atheros ath9k** (série AR9xxx): Melhor compatibilidade com LibreMesh
2. **Atheros ath10k** (série QCA9xxx): Bom desempenho, suporte mais amplo a Wi-Fi 6
3. **MediaTek MT76xx**: Alternativa confiável com boa relação custo/benefício
4. **Broadcom**: Suporte limitado ao LibreMesh, evite se possível

> **⚠️ Aviso**: Evite roteadores com chipsets sem fio Realtek, pois eles têm suporte ruim ao LibreMesh/OpenWrt.

### Requisitos de Interface de Rede

**Conectividade Ethernet**
- **Mínimo**: 1 porta LAN para configuração e conexões locais
- **Padrão**: 4 portas LAN + 1 porta WAN para instalações típicas
- **Avançado**: Portas Gigabit com suporte a PoE para implantações profissionais

**Considerações Especiais**
- **Flexibilidade da porta WAN**: Alguns dispositivos de porta única podem ser configurados com WAN via software
- **Capacidade PoE**: Essencial para instalações externas e alimentação remota
- **Integração de switch**: Switches integrados reduzem os requisitos de equipamento

## Modelos de Roteadores Recomendados por Categoria

### Opções Econômicas ($30-60)

**TP-Link Archer C7 v2/v5**
- Flash: 16 MB | RAM: 128 MB
- Banda dupla AC1750 (2.4GHz + 5GHz)
- Chipset Atheros QCA9558 + QCA9880
- Prós: Excelente suporte ao OpenWrt, confiabilidade comprovada
- Contras: Padrão Wi-Fi 5 mais antigo

**GL.iNet GL-AR300M16**
- Flash: 16 MB | RAM: 128 MB  
- Banda única N300 (apenas 2.4GHz)
- Chipset Atheros AR9331
- Prós: Tamanho compacto, OpenWrt pré-instalado
- Contras: Rádio único limita o desempenho mesh

### Opções de Gama Média ($60-120)

**TP-Link Archer C6 v3.x**
- Flash: 16 MB | RAM: 128 MB
- Banda dupla AC1200 (2.4GHz + 5GHz)
- MediaTek MT7621A + MT7603E/MT7613BE
- Prós: Bom custo-benefício, chipset estável
- Contras: Requer verificação cuidadosa da versão

**GL.iNet Flint (GL-AX1800)**
- Flash: 128 MB | RAM: 512 MB
- Banda dupla AX1800 Wi-Fi 6
- Chipset Qualcomm IPQ6010
- Prós: Suporte a Wi-Fi 6, grande memória
- Contras: Chipset mais recente com testes limitados da comunidade

### Profissional/Alto Desempenho ($120+)

**Ubiquiti Rocket M2/M5**
- Flash: 8 MB | RAM: 64 MB
- Rádios mesh dedicados de banda única
- Chipset Atheros AR7241 + AR9280
- Prós: Feitos sob medida para WISP/mesh, resistentes às intempéries
- Contras: Requerem ponto de acesso separado para clientes

**ASUS TUF-AX6000**
- Flash: 256 MB | RAM: 1 GB
- Tri-banda AX6000 Wi-Fi 6
- Chipset MediaTek MT7986A Filogic
- Prós: Desempenho de nível empresarial, memória extensa
- Contras: Maior consumo de energia, configuração complexa

### Opções Externas/Especializadas

**Ubiquiti NanoStation M2/M5**
- Flash: 8 MB | RAM: 32 MB
- Links ponto a ponto/ponto a multiponto
- Chipset Atheros AR7240 + AR9280
- Prós: Resistentes às intempéries, antena integrada, longo alcance
- Contras: Limitados para roteamento de uso geral

## Considerações Específicas por Marca

### Dispositivos TP-Link

**Vantagens:**
- Ampla compatibilidade com OpenWrt/LibreMesh
- Opções econômicas em todas as faixas de preço
- Boa disponibilidade mundial

**Considerações:**
- **Desbloqueio do FCC Lock**: Modelos mais novos podem exigir uma etapa intermediária com DD-WRT
- **Verificação de versão**: As revisões de hardware podem variar significativamente
- **Nomenclatura de firmware**: As imagens de fábrica devem corresponder exatamente à nomenclatura oficial

> **⚠️ Aviso sobre FCC Lock**: Dispositivos TP-Link fabricados após 2016 podem ter restrições de firmware. Procure erros "18005" ou "Invalid Filename" durante a gravação do firmware, que indicam proteção de bloqueio FCC.

### Dispositivos GL.iNet

**Vantagens:**
- OpenWrt pré-instalado com caminho fácil de atualização para LibreMesh
- Fatores de forma compactos e adequados para viagem
- Boa documentação e suporte da comunidade

**Considerações:**
- **OpenWrt personalizado**: Podem usar versões mais antigas ou modificadas do OpenWrt
- **Opções externas limitadas**: A maioria dos modelos é projetada para uso interno
- **Prêmio de preço**: Frequentemente mais caros do que opções TP-Link equivalentes

### Dispositivos ASUS

**Vantagens:**
- Hardware de alto desempenho com memória generosa
- Boa qualidade de construção e confiabilidade
- Recursos avançados de rede

**Considerações:**
- **Instalação complexa**: Podem exigir procedimentos de gravação específicos da ASUS
- **Custo mais alto**: Preço premium em comparação com alternativas
- **Requisitos de energia**: Frequentemente exigem mais energia do que opções econômicas

### Dispositivos Ubiquiti

**Vantagens:**
- Feitos sob medida para redes sem fio
- Opções externas resistentes às intempéries
- Excelente desempenho de longo alcance

**Considerações:**
- **Compatibilidade com AirOS**: Evite o AirOS 5.6.x (requer downgrade)
- **Roteamento limitado**: Alguns modelos são projetados apenas como pontes/pontos de acesso
- **Foco profissional**: Podem ser exagerados para implantações pequenas

## Árvore de Decisão para Seleção de Roteadores

### Para Redes Internas de Residência/Escritório
1. **Pequena (1-10 dispositivos)**: GL.iNet GL-AR300M16 ou TP-Link Archer C7
2. **Média (10-30 dispositivos)**: TP-Link Archer C6 v3 ou GL.iNet Flint
3. **Grande (30+ dispositivos)**: ASUS TUF-AX6000 ou múltiplos nós coordenados

### Para Redes Comunitárias Externas
1. **Links ponto a ponto**: Ubiquiti NanoStation M2/M5
2. **Backhaul mesh**: Ubiquiti Rocket M2/M5 com antenas setoriais
3. **Acesso de clientes**: Modelos TP-Link externos com invólucros resistentes às intempéries

### Para Implantações Mistas Internas/Externas
1. **Nós de backbone**: Roteadores internos de alto desempenho com boa refrigeração
2. **Nós de extensão**: Unidades externas resistentes às intempéries
3. **Acesso de clientes**: Pontos de acesso internos estrategicamente posicionados

## Checklist Pré-Compra

Antes de comprar qualquer roteador para uso com LibreMesh:

- [ ] **Verifique a compatibilidade com OpenWrt** na Tabela Oficial de Hardware
- [ ] **Confirme se a revisão do hardware** corresponde exatamente às versões suportadas
- [ ] **Confirme as especificações de memória** para atender aos requisitos da sua implantação
- [ ] **Pesquise a complexidade de instalação** para o seu modelo/revisão específico
- [ ] **Verifique os tipos de conectores de antena** se antenas externas forem necessárias
- [ ] **Verifique os requisitos de energia** e a compatibilidade com PoE, se necessário
- [ ] **Leia relatos recentes da comunidade** nas listas de discussão/fóruns do LibreMesh
## Erros Comuns a Evitar

### Erros na Seleção de Hardware
- **Memória insuficiente**: 4MB de flash ou 32MB de RAM limitam severamente a funcionalidade
- **Revisão de hardware incorreta**: Diferentes revisões podem ter procedimentos de instalação incompatíveis
- **Chipsets não suportados**: Chipsets Realtek ou wireless proprietários
- **Limitação de banda única**: Roteadores apenas 2.4GHz limitam o desempenho da mesh

### Considerações na Compra
- **Confusão de versões**: Garanta a compatibilidade exata do modelo e revisão
- **Bloqueio de firmware**: Dispositivos mais novos podem ter restrições de instalação
- **Limitações de antena**: Antenas não removíveis limitam a flexibilidade de implantação
- **Fonte de alimentação**: Adaptadores de energia ausentes ou incompatíveis

## Próximos Passos

Depois de selecionar o hardware adequado:

1. **Vá para o [Guia de Instalação do LibreMesh](libremesh-installation.md)** para os procedimentos de gravação do firmware
2. **Consulte o [Guia de Solução de Problemas de Roteadores](router-troubleshooting.md)** para procedimentos de recuperação
3. **Planeje sua topologia de rede** considerando as capacidades de rádio e os requisitos de cobertura
4. **Prepare as ferramentas de instalação**, incluindo os cabos e softwares apropriados

> **📖 Leitura Relacionada**: Para instruções detalhadas de instalação específicas do modelo de roteador escolhido, consulte a documentação de hardware do LibreMesh e as páginas de dispositivos do OpenWrt antes de iniciar a instalação do firmware.