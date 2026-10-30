---
title: Verificação de Compatibilidade
sourcePath: guides/hardware-compatibility-check.md
sourceHash: 19c6e673b1561c82
translatedBy: glm-4.6
---

# Guia de Verificação de Compatibilidade de Hardware para Servidores Reciclados

## Visão Geral

Este guia fornece procedimentos abrangentes para verificar e testar a compatibilidade de componentes em computadores reciclados antes de implantá-los como servidores comunitários. Testes adequados de compatibilidade evitam problemas na implantação e garantem operação estável.

## Preparação Pré-Teste

### Lista de Verificação da Avaliação Inicial
- [ ] Documentar todos os componentes de hardware visíveis
- [ ] Fotografar a configuração atual
- [ ] Anotar os números de modelo e números de série
- [ ] Verificar danos físicos evidentes
- [ ] Verificar se todos os cabos e conexões estão presentes
- [ ] Garantir espaço de trabalho e ferramentas adequados

### Ferramentas e Softwares Necessários
- **Ferramentas de Hardware**:
  - Jogo de chaves de fenda Phillips
  - Pulseira antiestática
  - Multímetro digital
  - Lata de ar comprimido
  - Pasta térmica (se necessário)
  - Componentes de reposição conhecidos como bons para testes

- **Ferramentas de Software**:
  - USB inicializável com ferramentas de diagnóstico
  - CPU-Z para identificação de componentes
  - MemTest86+ para teste de RAM
  - CrystalDiskInfo para saúde do armazenamento
  - Prime95 ou software de teste de estresse
  - Utilitários de diagnóstico do fabricante do hardware

## Verificação de Compatibilidade da CPU

### Compatibilidade de Soquete e Chipset
1. **Identificar a CPU Atual**:
   - Use o CPU-Z para identificar o modelo exato
   - Verifique o tipo de soquete (LGA1151, AM4, etc.)
   - Verifique a compatibilidade do chipset

2. **Verificar Opções de Atualização**:
   ```
   Formato de Busca: "[Motherboard Model] CPU compatibility list"
   Exemplo: "Dell OptiPlex 7050 supported CPU list"
   ```

3. **Verificação de Suporte da BIOS**:
   - Verifique a versão atual da BIOS
   - Verifique se a CPU requer atualização da BIOS
   - Baixe a BIOS mais recente do fabricante

### Procedimento de Teste da CPU
```bash
# Basic CPU Information
lscpu                    # Linux command
wmic cpu get name        # Windows command

# Stress Testing
prime95                  # Run for 30 minutes minimum
stress -c 4 -t 1800     # Linux stress test
```

### Validação de Desempenho
- [ ] Todos os núcleos detectados corretamente
- [ ] Frequências de operação dentro da especificação
- [ ] Temperatura abaixo de 80°C sob carga
- [ ] Nenhum throttling térmico detectado
- [ ] Recursos de virtualização habilitados (se necessário)

## Teste de Compatibilidade da Memória (RAM)

### Verificação das Especificações da Memória

| Fator | Método de Verificação | Requisitos |
|--------|--------------|--------------|
| Tipo | Inspeção física/CPU-Z | DDR3/DDR4 compatível com a placa-mãe |
| Velocidade | Configurações BIOS/UEFI | Suportada tanto pela CPU quanto pela placa-mãe |
| Capacidade | Propriedades do Sistema | Dentro do máximo da placa-mãe |
| Timings | Teste de estresse da memória | Estável nas velocidades nominais |
| ECC | Documentação do hardware | Compatível com o suporte a ECC da placa-mãe |

### Protocolo de Teste da Memória

#### Etapa 1: Teste Básico de Reconhecimento
```bash
# Linux Memory Detection
free -h
cat /proc/meminfo
dmidecode --type memory

# Windows Memory Detection
wmic memorychip get capacity,speed,memorytype
```

#### Etapa 2: Teste Abrangente de Memória
1. **Inicie o MemTest86+** a partir do drive USB
2. **Execute ciclos completos de teste** (mínimo 2 passagens)
3. **Teste cada pente individualmente** se ocorrerem erros
4. **Teste diferentes combinações de slots**

#### Etapa 3: Teste de Memória pelo Sistema Operacional
```bash
# Windows Memory Diagnostic
mdsched.exe

# Linux Memory Test
memtester 1024M 5    # Test 1GB, 5 iterations
```

### Matriz de Compatibilidade de Memória

| Geração da Placa-Mãe | Tipos Suportados | Capacidade Máxima | Velocidades |
|----------------------|----------------|--------------|---------|
| Intel 6ª-8ª Geração | DDR4 | 32-64 GB | 2133-2666 MHz |
| Intel 4ª-5ª Geração | DDR3/DDR3L | 16-32 GB | 1333-1600 MHz |
| AMD AM4 | DDR4 | 64-128 GB | 2133-3200 MHz |
| AMD FM2+ | DDR3 | 32 GB | 1333-2133 MHz |

## Avaliação de Compatibilidade de Armazenamento

### Verificação de Compatibilidade de Interface

#### Compatibilidade SATA
```bash
# Check SATA mode (AHCI/IDE)
dmesg | grep -i sata
lspci | grep -i sata

# Windows SATA information
devmgmt.msc (Device Manager > IDE ATA/ATAPI controllers)
```

#### Compatibilidade NVMe
- **Requisitos**: Slot M.2 PCIe 3.0+ com suporte a NVMe
- **Configuração da BIOS**: Modo NVMe habilitado
- **Suporte a Boot**: Firmware UEFI com capacidade de boot NVMe

### Procedimentos de Teste de Armazenamento

#### Avaliação de Saúde
1. **Verificar a Saúde do Drive**:
   ```bash
   # Linux
   smartctl -a /dev/sda
   hdparm -I /dev/sda
   
   # Windows
   wmic diskdrive get status
   chkdsk C: /f
   ```

2. **Testes de Desempenho**:
   ```bash
   # Sequential Read/Write Test
   dd if=/dev/zero of=/tmp/testfile bs=1G count=1 oflag=direct
   dd if=/tmp/testfile of=/dev/null bs=1G count=1 iflag=direct
   
   # Windows (using CrystalDiskMark)
   crystaldiskmark.exe
   ```

### Matriz de Compatibilidade de Armazenamento

| Interface | Velocidade | Hot-Swap | Suporte a Boot | Uso Recomendado |
|-----------|--------|----------|--------------|-----------------|
| SATA III | 6 Gbps | Sim* | Sim | Armazenamento primário |
| SATA II | 3 Gbps | Sim* | Sim | Armazenamento secundário |
| NVMe | 32 Gbps | Não | Sim** | Drive de boot/sistema |
| USB 3.0 | 5 Gbps | Sim | Limitado | Externo/backup |

*Requer gabinete com capacidade de hot-swap
**Requer firmware UEFI

## Teste de Componentes de Rede

### Verificação do Controlador Ethernet
```bash
# Linux Network Interface Check
ip link show
ethtool eth0
lspci | grep -i ethernet

# Windows Network Adapter Check
ipconfig /all
devmgmt.msc (Network adapters)
```

### Testes de Desempenho de Rede
1. **Verificação da Velocidade do Link**:
   ```bash
   # Check negotiated speed
   ethtool eth0 | grep Speed
   cat /sys/class/net/eth0/speed
   ```

2. **Testes de Throughput**:
   ```bash
   # iperf3 network performance test
   iperf3 -s                    # Server mode
   iperf3 -c [server_ip]        # Client mode
   ```

### Compatibilidade Sem Fio (se aplicável)
- **Disponibilidade de Drivers**: Verifique o suporte a drivers Linux/Windows
- **Suporte a Padrões**: 802.11n no mínimo (802.11ac preferível)
- **Recursos Corporativos**: Suporte a WPA2-Enterprise, 802.1X

## Compatibilidade da Fonte de Alimentação

### Cálculo dos Requisitos de Energia

| Componente | Consumo Típico | Consumo de Alto Desempenho |
|-----------|-------------------|-------------------|
| CPU Intel i5 | 65W | 95W |
| CPU Intel i7 | 65W | 125W |
| RAM DDR4 (8GB) | 3W | 5W |
| SSD 2.5" | 2W | 3W |
| HDD 3.5" | 6W | 10W |
| Placa-mãe | 25W | 35W |
| Placa de Rede | 5W | 10W |

### Protocolo de Teste da Fonte (PSU)
1. **Teste de Tensão**:
   ```bash
   # Check PSU voltages under load
   sensors            # Linux hardware monitoring
   +3.3V: 3.14V - 3.47V (±5%)
   +5V:   4.75V - 5.25V (±5%)
   +12V:  11.40V - 12.60V (±5%)
   ```

2. **Teste de Carga**:
   - Execute teste de estresse na CPU e GPU simultaneamente
   - Monitore as tensões durante todo o teste
   - Verifique a estabilidade do sistema sob carga máxima

### Requisitos de Compatibilidade da Fonte (PSU)
- **Potência**: 150% do consumo máximo calculado
- **Eficiência**: 80 PLUS Bronze no mínimo
- **Conectores**: Compatíveis com os requisitos da placa-mãe e armazenamento
- **Formato**: Compatibilidade ATX/SFX com o gabinete

## Compatibilidade de Placas de Expansão

### Verificação dos Slots PCIe
```bash
# Check available PCIe slots
lspci -vv
lspci | grep -i pci

# Check PCIe versions and lanes
lspci -vvv | grep LnkCap
```

### Testes de Placas de Expansão Comuns

#### Placas de Interface de Rede
- **Compatibilidade de Drivers**: Suporte do sistema operacional
- **Desempenho**: Throughput Gigabit no mínimo
- **Recursos**: Suporte a VLAN, jumbo frames

#### Controladores de Armazenamento
- **Suporte a RAID**: RAID por hardware vs. software
- **Compatibilidade de Drives**: Matriz de suporte SATA/SAS
- **Desempenho**: Benchmarks de IOPs e throughput

## Verificação do Gerenciamento Térmico

### Avaliação do Sistema de Refrigeração
1. **Verificação do Funcionamento dos Ventiladores**:
   ```bash
   # Monitor fan speeds
   sensors
   pwmconfig          # Configure PWM fan control
   ```

2. **Monitoramento de Temperatura**:
   ```bash
   # Continuous temperature monitoring
   watch sensors
   stress --cpu 4 --timeout 600s  # 10-minute stress test
   ```

### Protocolo de Teste Térmico
- **Temperaturas em Ocioso**: < 40°C para a CPU
- **Temperaturas sob Carga**: < 80°C para a CPU sob estresse
- **Resposta dos Ventiladores**: Ajuste automático de velocidade baseado na temperatura
- **Throttling Térmico**: Sem throttling sob cargas normais de servidor

## Automação de Testes de Compatibilidade

### Script de Detecção de Hardware
```bash
#!/bin/bash
# Automated hardware compatibility check

echo "=== Hardware Compatibility Check ==="
echo "Date: $(date)"
echo

echo "=== CPU Information ==="
lscpu | grep -E "(Model name|Architecture|CPU MHz|Core|Thread)"

echo "=== Memory Information ==="
free -h
dmidecode --type memory | grep -E "(Size|Speed|Type):"

echo "=== Storage Information ==="
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
df -h

echo "=== Network Information ==="
ip link show
ethtool eth0 2>/dev/null | grep -E "(Speed|Duplex)"

echo "=== PCIe Information ==="
lspci | grep -E "(VGA|Ethernet|SATA|USB)"

echo "=== Temperature Information ==="
sensors 2>/dev/null || echo "lm-sensors not installed"
```

### Script em Windows PowerShell
```powershell
# Hardware compatibility check for Windows
Write-Host "=== Hardware Compatibility Check ===" -ForegroundColor Green
Write-Host "Date: $(Get-Date)" -ForegroundColor Yellow

Write-Host "`n=== CPU Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed

Write-Host "`n=== Memory Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_PhysicalMemory | Select-Object Capacity, Speed, MemoryType

Write-Host "`n=== Storage Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_DiskDrive | Select-Object Model, Size, InterfaceType

Write-Host "`n=== Network Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_NetworkAdapter | Where-Object {$_.NetEnabled -eq $true} | Select-Object Name, Speed
```

## Documentação de Compatibilidade

### Modelo de Resultados de Teste
```
Hardware Compatibility Test Results
=====================================
Date: ___________
Technician: ___________
System Model: ___________

CPU Compatibility:
[ ] Socket match confirmed
[ ] BIOS support verified
[ ] Stress test passed (30 min)
[ ] All cores operational
Notes: ________________________

Memory Compatibility:
[ ] Type match (DDR3/DDR4)
[ ] Speed supported
[ ] All slots functional
[ ] MemTest86+ passed (2 cycles)
Notes: ________________________

Storage Compatibility:
[ ] Interface supported (SATA/NVMe)
[ ] BIOS boot support
[ ] Health check passed
[ ] Performance adequate
Notes: ________________________

Network Compatibility:
[ ] Driver available
[ ] Gigabit speed confirmed
[ ] Auto-negotiation working
[ ] Cable test passed
Notes: ________________________

Power Supply:
[ ] Wattage adequate
[ ] All voltages stable
[ ] Load test passed
[ ] Efficiency acceptable
Notes: ________________________

Final Assessment:
[ ] All components compatible
[ ] System ready for deployment
[ ] Requires component replacement: ________
[ ] Not suitable for server use

Signature: ___________________
```

## Solução de Problemas Comuns

### Problemas de Compatibilidade de Memória
**Sintomas**: Sistema não inicializa, travamentos aleatórios, telas azuis
**Soluções**:
- Teste os pentes de memória individualmente
- Verifique os tipos de memória suportados no manual da placa-mãe
- Atualize a BIOS para a versão mais recente
- Ajuste os timings da memória na BIOS
- Use memória da QVL (Qualified Vendor List) da placa-mãe

### Problemas de Compatibilidade de Armazenamento
**Sintomas**: Drive não detectado, desempenho lento, falhas de inicialização
**Soluções**:
- Verifique o modo SATA (AHCI vs IDE) na BIOS
- Verifique as conexões dos cabos e teste diferentes portas SATA
- Atualize os drivers do controlador de armazenamento
- Habilite o suporte a NVMe na BIOS para drives M.2
- Verifique atualizações de firmware nos dispositivos de armazenamento

### Problemas de Compatibilidade de Rede
**Sintomas**: Sem conectividade de rede, velocidades limitadas, problemas de driver
**Soluções**:
- Baixe e instale os drivers de rede mais recentes
- Verifique as conexões de cabo e porta
- Teste com um cabo de rede conhecido como bom
- Verifique as configurações de rede na BIOS
- Considere uma placa de rede adicional se a integrada falhar
## Checklist de Garantia de Qualidade

### Verificação Final de Compatibilidade
- [ ] Todos os componentes devidamente detectados pelo sistema operacional
- [ ] Sem conflitos de hardware no Device Manager (Gerenciador de Dispositivos)
- [ ] Sistema estável sob carga por 24+ horas
- [ ] Todos os recursos esperados funcionais
- [ ] Desempenho atende aos requisitos mínimos
- [ ] Documentação completa e precisa

### Protocolo de Teste de Burn-in
1. **Teste de Estresse de 48 Horas**:
   - CPU: carga de 100% por 8 horas diárias
   - Memória: rotação contínua de testes
   - Armazenamento: testes de ciclos de leitura/gravação
   - Rede: testes contínuos de taxa de transferência

2. **Monitoramento de Temperatura**:
   - Registrar temperaturas durante todo o burn-in
   - Verificar ausência de thermal throttling (limitação térmica)
   - Confirmar o funcionamento dos ventiladores em diversas cargas

3. **Verificação de Estabilidade**:
   - Sem travamentos ou congelamentos do sistema
   - Sem mensagens de erro nos logs do sistema
   - Todos os componentes mantendo o desempenho nominal

## Próximos Passos

Após concluir os testes de compatibilidade:

1. **Documentar os Resultados**: Preencher o relatório de testes de compatibilidade
2. **Preparação Física**: Seguir o guia de [Preparação de Reciclados](recycled-preparation.md)
3. **Sistema Operacional**: Instalar e configurar o sistema operacional do servidor
4. **Configuração de Serviços**: Implantar os serviços de servidor pretendidos

---

*Os testes de compatibilidade devem ser realizados em um ambiente controlado com as devidas precauções de segurança. Sempre verifique a compatibilidade com o sistema operacional e os aplicativos de servidor pretendidos.*