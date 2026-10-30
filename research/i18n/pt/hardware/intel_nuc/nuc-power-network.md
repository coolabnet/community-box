---
title: Energia e Rede
sourcePath: hardware/intel_nuc/nuc-power-network.md
sourceHash: ff706946c051892b
translatedBy: glm-4.6
---

# Guia de Configuração de Fonte de Alimentação, Armazenamento e Rede do Intel NUC

## Introdução

Otimizar a fonte de alimentação, as opções de armazenamento e a conectividade de rede é crucial para uma implantação confiável de servidores Intel NUC. Este guia fornece recomendações abrangentes para esses componentes críticos ao usar Intel NUCs como plataformas de servidor comunitário com YunoHost, Caprover, CasaOS ou soluções semelhantes de self-hosting.

## Considerações sobre Fonte de Alimentação

### Adaptadores de Energia Oficiais

Intel NUCs exigem adaptadores de energia específicos que variam por modelo:

| Série NUC | Potência | Tipo de Conector | Observações |
|------------|--------------|----------------|-------|
| NUC13 Padrão | 19V, 90W | Barrel de 5,5mm | Configuração mais comum |
| NUC12/13 Pro | 19V, 120W | Barrel de 5,5mm | Modelos de maior potência |
| ROG NUC 2025 | 19,5V, 230W | Barrel de 7,4mm | Variantes gaming/alto desempenho |
| NUCs mais antigos | 19V, 65W | Barrel de 5,5mm | Modelos antigos (NUC10 e anteriores) |

#### Especificações Importantes
- **Tensão de Saída**: Sempre 19-19,5V DC
- **Potência**: Correspondência da potência com o seu modelo específico
- **Tamanho do Conector**: Barrel de 5,5mm x 2,5mm (modelos padrão)
- **Polaridade**: Centro positivo (+) em todos os modelos

### Boas Práticas para Adaptadores de Energia

#### ✅ Recomendado
- **Usar adaptadores OEM** sempre que possível
- **Adaptadores de terceiros de qualidade** com certificação UL/CE
- **Adaptadores com proteção contra sobrecorrente integrada**
- **Bitola de cabo adequada** para o comprimento (mais grossa para distâncias maiores)

#### ❌ Evitar
- **Adaptadores universais** com múltiplas pontas/tensões selecionáveis
- **Adaptadores com potência insuficiente** (abaixo da potência especificada)
- **Adaptadores baratos e não certificados** que podem danificar componentes
- **Adaptadores sem certificações de segurança**

### Fonte de Alimentação Ininterrupta (UPS)

Para implantações de servidores, um UPS é fortemente recomendado:

#### Especificações Mínimas do UPS
- **Capacidade**: 300-500VA para NUCs padrão
- **Saída**: Onda senoidal pura preferível (mas não obrigatória)
- **Tempo de Execução**: Mínimo de 10-15 minutos em carga total
- **Tipo de Bateria**: Chumbo-ácido selada ou íon de lítio
- **Comunicação**: Interface USB para desligamento automático

#### Modelos de UPS Recomendados
- **APC BE600M1**: Nível de entrada, 600VA/330W, 7 tomadas
- **CyberPower CP1000PFCLCD**: Intermediário, 1000VA/600W, onda senoidal pura
- **APC BR1500MS**: Avançado, 1500VA/900W, onda senoidal, AVR
- **Tripp Lite SMART1500LCDT**: 1500VA/900W, display LCD, tempo de execução estendido

#### Dicas de Configuração do UPS
1. Conecte o NUC a uma tomada com suporte de bateria
2. Instale software de monitoramento de UPS no servidor
3. Configure parâmetros de desligamento automático
4. Teste a funcionalidade do UPS trimestralmente
5. Substitua as baterias a cada 3-5 anos

### Planejamento do Consumo de Energia

Intel NUCs são extremamente eficientes em termos de energia em comparação com servidores tradicionais:

| Modelo | Consumo em Ocioso | Carga Típica | Carga Pesada | Custo Anual* |
|-------|------------|--------------|------------|--------------|
| NUC Modelos i3 | 4-8W | 15-25W | 35W | $15-30 |
| NUC Modelos i5 | 6-10W | 20-35W | 45W | $20-40 |
| NUC Modelos i7 | 8-12W | 25-40W | 50W | $25-45 |
| ROG NUC | 20-30W | 80-120W | 160W+ | $80-150 |

*Baseado em $0,12/kWh, operação 24/7

#### Dicas de Eficiência Energética
- Ative os recursos de gerenciamento de energia no BIOS
- Use armazenamento SSD em vez de discos mecânicos
- Configure as opções de gerenciamento de energia do sistema operacional
- Agende serviços não críticos em horários de menor demanda
- Monitore o consumo de energia com tomadas inteligentes ou software de UPS

## Configuração de Armazenamento

Intel NUCs oferecem múltiplas opções de armazenamento que podem ser otimizadas para implantação de servidores.

### Tipos de Interface de Armazenamento

| Interface | Velocidade | Uso Típico | Consumo de Energia | Recomendado Para |
|-----------|-------|-------------|-------------------|-----------------|
| M.2 NVMe PCIe 4.0 | Até 7.000 MB/s | SO, bancos de dados | 5-8W | Aplicações de alto desempenho |
| M.2 NVMe PCIe 3.0 | Até 3.500 MB/s | SO, contêineres | 4-7W | Desempenho/custo equilibrado |
| M.2 SATA | Até 550 MB/s | Armazenamento geral | 2-4W | Configurações econômicas |
| SSD SATA de 2,5" | Até 550 MB/s | Armazenamento de mídia | 2-5W | Necessidades de grande capacidade |
| HDD SATA de 2,5" | Até 150 MB/s | Arquivamento | 5-10W | Não recomendado |

### Recomendações de Configuração de Armazenamento

#### Unidade de Sistema (SO e Aplicativos)
- **Recomendado**: SSD NVMe (mínimo 250GB)
- **Modelos Preferidos**: Samsung 980 Pro, WD Black SN850, Kingston KC3000
- **Durabilidade Mínima**: 300 TBW para uso em servidores
- **Over-provisioning**: 20% de espaço não alocado para maior vida útil

#### Armazenamento de Dados
- **Recomendado**: SSD SATA para o compartimento de 2,5" (se disponível)
- **Modelos Preferidos**: Samsung 870 EVO, Crucial MX500, WD Blue
- **Capacidade**: 1-4TB dependendo das necessidades
- **Consideração**: Armazenamento externo para requisitos de maior capacidade

#### Configuração de Duas Unidades (Ótima)
1. **Unidade de Sistema**: 500GB-1TB NVMe para SO e aplicativos
2. **Unidade de Dados**: SSD SATA de 2-4TB para dados de usuários, mídia e backups

### Configuração de Armazenamento por Modelo de NUC

| Modelo NUC | Opções de Armazenamento | Configuração Ótima |
|-----------|----------------|------------------------|
| NUC13ANHi3/i5/i7 | 1x M.2 + 1x SATA de 2,5" | 1TB NVMe + 2TB SSD SATA |
| NUC13ANKi5/i7 | 2x slots M.2 | 1TB NVMe (SO) + 2TB NVMe (dados) |
| ROG NUC 2025 | 2x slots M.2 | 2TB NVMe (SO) + 4TB NVMe (dados) |

### Dicas de Otimização de Armazenamento

#### Otimização de Desempenho
1. **Usar TRIM**: Ative o suporte a TRIM no sistema operacional
2. **Seleção do Sistema de Arquivos**:
   - ext4 para uso geral em Linux
   - ZFS para integridade de dados (maiores requisitos de RAM)
   - Btrfs para recursos de snapshots
3. **Alinhamento de Partições**: Garanta o alinhamento adequado para SSDs
4. **Over-provisioning**: Deixe 10-20% de espaço não alocado
5. **Configuração de Swap**: Uso mínimo de swap com SSDs

#### Considerações de Confiabilidade
1. **Backups Regulares**: Estratégia de backup 3-2-1 é essencial
2. **Monitoramento SMART**: Instale e configure o smartmontools
3. **Nivelamento de Desgaste**: Escolha SSDs com bons algoritmos de wear-leveling
4. **Monitoramento de Temperatura**: Mantenha as unidades dentro da faixa de temperatura ideal
5. **Manutenção Programada**: Verificações periódicas do sistema de arquivos

### Opções de Armazenamento Externo

Para expandir além da capacidade interna:

#### Armazenamento de Conexão Direta (DAS)
- **Gabinetes USB 3.2/Thunderbolt**: Alta velocidade, conexão direta
- **Modelos Recomendados**: Sabrent, Orico, CalDigit
- **Conexão**: USB 3.2 Gen 2 ou Thunderbolt para melhor desempenho
- **Configuração**: Opções JBOD ou RAID por hardware

#### Armazenamento Conectado à Rede (NAS)
- **Recomendação**: Synology, QNAP, ou solução NAS personalizada
- **Conexão**: Via rede Ethernet
- **Protocolo**: SMB/CIFS, NFS, ou iSCSI
- **Considerações**: A largura de banda da rede torna-se o fator limitante
## Conectividade de Rede

Otimizar a conectividade de rede é essencial para uma operação confiável do servidor.

### Interfaces de Rede Integradas

| Geração de NUC | Interface Padrão | Velocidade | Recursos |
|----------------|-------------------|-------|----------|
| NUC 13 (ASUS) | Intel I225-V | 2.5 Gigabit | Wake-on-LAN, PXE |
| NUC 12 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| NUC 11 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| ROG NUC 2025 | Intel I225-LM | 2.5 Gigabit | Gerenciamento avançado |

### Configuração da Interface de Rede

#### Configuração Básica
1. **Atualize os drivers** para a versão mais recente
2. **Ative o Wake-on-LAN** no BIOS e no sistema operacional
3. **Configure IP estático** por meio de reserva DHCP ou atribuição estática
4. **Defina o MTU adequado** (normalmente 1500, ou 9000 para jumbo frames, se suportado)
5. **Desative protocolos não utilizados** para reduzir a superfície de ataque

#### Ajustes Avançados (Linux)
```bash
# Increase network buffers
echo 'net.core.rmem_max=16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' >> /etc/sysctl.conf

# Optimize TCP settings
echo 'net.ipv4.tcp_rmem=4096 87380 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem=4096 65536 16777216' >> /etc/sysctl.conf

# Apply changes
sysctl -p
```

### Múltiplas Interfaces de Rede

Para configurações de servidor mais complexas que exigem múltiplas NICs:

#### Adaptadores USB-to-Ethernet
- **Chipsets Recomendados**: Realtek RTL8153, AX88179
- **Opções de Velocidade**: 1Gbps ou 2.5Gbps disponíveis
- **Compatibilidade**: Excelente com Linux, instalação de driver necessária para Windows Server
- **Limitações**: Menor taxa de transferência que as NICs internas, usa largura de banda USB

#### Adaptadores de Rede Thunderbolt
- **Vantagens**: Desempenho quase nativo, múltiplas portas disponíveis
- **Modelos Recomendados**: CalDigit, OWC, Sonnet
- **Configuração**: Pode ser usado para serviços dedicados ou VLANs
- **Considerações**: Custo mais alto, pode exigir alimentação externa

### Conectividade Sem Fio

Embora conexões com fio sejam preferidas para servidores, opções sem fio estão disponíveis:

#### Configuração Wi-Fi
- **Padrões**: Wi-Fi 6/6E (802.11ax) integrado na maioria dos NUCs recentes
- **Casos de Uso**: Conectividade secundária, redes isoladas
- **Segurança**: Criptografia WPA3, filtragem MAC, VLANs isoladas
- **Limitações**: Não recomendado como conexão principal do servidor

#### Bluetooth
- **Disponibilidade**: Integrado em todos os NUCs modernos
- **Casos de Uso**: Limitado para servidores, possivelmente para sensores ou conectividade de periféricos
- **Compatibilidade**: Pode não funcionar em ambientes de sistema operacional de servidor
- **Recomendação**: Desative no BIOS se não for necessário

### Considerações de Segurança de Rede

#### Configuração de Firewall
1. **Ative o firewall do sistema operacional** com política de negação padrão
2. **Abra apenas as portas necessárias** para serviços específicos
3. **Implemente limitação de taxa** para SSH e serviços web
4. **Registre todas as tentativas de conexão** para monitoramento
5. **Auditoria regular** de portas abertas e serviços

#### Segregação de VLAN (Avançado)
- **VLAN separada** para acesso de gerenciamento
- **VLAN dedicada** para serviços expostos
- **VLAN interna** para comunicação entre servidores
- **Requisitos**: Switch com suporte a VLAN, configuração adequada do roteador

## Redundância de Energia e Rede

### Opções de Redundância de Energia
- **Múltiplas unidades de UPS** para instalações críticas
- **Monitoramento de energia** e alertas
- **Janelas de manutenção programadas** para atualizações
- **Reinicialização automática** após falha de energia (configuração do BIOS)

### Opções de Redundância de Rede
- **Configuração dual-NIC** com bonding/teaming
- **Conexão secundária de ISP** para serviços críticos
- **Scripts de failover** para monitoramento de conexão
- **Monitoramento de rede** com recursos de alerta

## Melhores Práticas de Implementação

### Cabeamento e Organização
- **Cabos CAT6/6A de qualidade** para todas as conexões com fio
- **Gerenciamento adequado de cabos** para evitar desconexões
- **Cabos identificados** para fácil reconhecimento
- **Alívio de tensão** para todas as conexões
- **Ventilação adequada** ao redor dos equipamentos

### Documentação
- **Diagrama de rede** mostrando todas as conexões
- **Inventário de endereços IP** com endereços MAC
- **Catálogo de serviços** mapeando serviços para portas
- **Procedimentos de manutenção** para tarefas comuns
- **Backup de configuração** para todos os dispositivos de rede

### Configuração de Monitoramento
- **Implemente Prometheus/Grafana** para monitoramento
- **Monitoramento SNMP** dos equipamentos de rede
- **Acompanhamento do consumo de energia**
- **Monitoramento de temperatura** de todos os componentes
- **Monitoramento de uso de disco e SMART**

## Considerações Específicas por Plataforma

### YunoHost
- **Rede**: Requer conexão direta ao roteador para DHCP/DNS adequados
- **Armazenamento**: Mínimo de 32GB para o sistema, partição de dados separada recomendada
- **Energia**: Configuração padrão funciona bem, UPS recomendado

### CasaOS
- **Rede**: Funciona bem com configuração padrão
- **Armazenamento**: Discos separados para sistema e dados recomendados
- **Energia**: Muito eficiente, até um UPS básico é suficiente

### Caprover
- **Rede**: Encaminhamento de portas para 80, 443, 3000 necessário
- **Armazenamento**: SSD fortemente recomendado para desempenho de contêineres
- **Energia**: Configuração padrão, UPS recomendado para produção

## Solução de Problemas Comuns

### Problemas de Rede
- **Sem conectividade**: Verifique conexões físicas, instalação de drivers
- **Problemas de driver**: Instalação manual frequentemente necessária para sistemas operacionais de servidor
- **Falha no Wake-on-LAN**: Verifique se as configurações do BIOS e do sistema operacional correspondem
- **Desempenho lento**: Atualize drivers, verifique QoS/limitação

### Problemas de Armazenamento
- **Não detectado**: Verifique as configurações do BIOS, instalação física
- **Desempenho lento**: Verifique limitação térmica, atualizações de firmware
- **Preocupações de confiabilidade**: Execute testes SMART, verifique o firmware
- **Limitações de capacidade**: Considere opções de expansão externa

### Problemas de Energia
- **Desligamentos inesperados**: Verifique a classificação da fonte de alimentação, funcionalidade do UPS
- **Não liga**: Verifique as conexões e a saída do adaptador de energia
- **Preocupações com eficiência energética**: Atualize o gerenciamento de energia do BIOS
- **Problemas relacionados ao calor**: Melhore a ventilação, limpe o sistema de resfriamento

## Caminho de Atualização e Expansão

### Considerações de Preparação para o Futuro
- **Comece com componentes de qualidade**: Priorize confiabilidade em vez de capacidade
- **Planeje a expansão**: Considere opções externas desde o início
- **Manutenção regular**: Atualizações de firmware e drivers
- **Monitoramento**: Implemente monitoramento adequado desde o início

### Opções de Atualização
- **Memória**: RAM máxima proporciona maior vida útil
- **Armazenamento**: Comece com NVMe de qualidade, expanda com opções externas
- **Rede**: Considere Thunderbolt para capacidades de expansão
- **Serviços**: Containerização para migração fácil para novo hardware

---

**Próximos Passos:**
- Complete a configuração do BIOS: [nuc-bios-setup.md](nuc-bios-setup.md)
- Revise detalhes específicos de cada modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

*Sempre verifique as recomendações específicas com as especificações exatas do seu modelo de NUC antes da compra.*