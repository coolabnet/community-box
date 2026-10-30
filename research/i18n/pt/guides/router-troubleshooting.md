---
title: Solução de Problemas de Roteador
sourcePath: guides/router-troubleshooting.md
sourceHash: cce5d4c4d3a82707
translatedBy: glm-4.6
---

# Guia de Solução de Problemas de Roteadores

Este guia fornece procedimentos sistemáticos de solução de problemas para problemas comuns de configuração e instalação de firmware em roteadores, incluindo flash incompleto, dispositivos que não respondem, restauração de firmware, práticas de reset físico e métodos avançados de recuperação via serial.

## Referência Rápida de Resposta a Emergências

### Ações Imediatas para Roteador Brickado

**Se o seu roteador parecer "brickado" (sem resposta):**

1. **Mantenha a calma**: A maioria das situações é recuperável
2. **Não ligue e desligue repetidamente**: Isso pode piorar a situação
3. **Verifique os padrões dos LEDs**: Observe o comportamento atual para diagnóstico
4. **Verifique a fonte de alimentação**: Garanta voltagem e corrente adequadas
5. **Tente o reset de hardware**: Siga os procedimentos específicos de cada marca abaixo

> **⚠️ Importante**: Nunca tente vários métodos de recuperação simultaneamente. Conclua um método totalmente antes de tentar outro.

## Procedimentos de Reset de Hardware

### Método Universal do Botão de Reset

*`[Reset Button Location](router-reset-button.png)` — Foto destacada de um botão de reset de hardware típico em um roteador, mostrando a localização do botão e os indicadores ao redor.*

**Procedimento Básico de Reset**:
1. **Localize o botão de reset**: Geralmente um orifício recuado com o rótulo "RESET"
2. **Prepare a ferramenta**: Clipe de papel, alfinete ou objeto pontiagudo similar
3. **Ligue o roteador**: Garanta que o dispositivo esteja totalmente energizado
4. **Pressione e segure**: Insira a ferramenta e pressione o botão com firmeza
5. **Duração da pressão**: 10-30 segundos, dependendo do fabricante
6. **Solte e aguarde**: Deixe o roteador concluir o ciclo de reinicialização

### Procedimentos de Reset Específicos por Marca

**Roteadores TP-Link**:
```
Estado de Energia: LIGADO
Botão: WPS/RESET
Duração: 10+ segundos
Indicador: LED SYS muda de pulso lento para pulso rápido
Ação: Solte o botão quando o padrão do LED mudar
```

**Roteadores ASUS**:
```
Estado de Energia: LIGADO
Botão: RESET (painel traseiro)
Duração: 5-10 segundos
Indicador: LED de energia pisca rapidamente
Ação: Solte quando o comportamento do LED mudar
```

**Roteadores GL.iNet**:
```
Estado de Energia: LIGADO
Botão: RESET
Duração: 10 segundos
Indicador: LED apaga brevemente e depois fica fixo
Ação: Solte quando o LED estabilizar
```

**Dispositivos Ubiquiti**:
```
Estado de Energia: Ligar enquanto segura o botão
Botão: RESET
Duração: Segurar durante a inicialização por 10 segundos
Indicador: Sequência do LED muda
Especial: Para recuperação via TFTP, continue segurando até um padrão específico de LED
```

**Roteadores Netgear**:
```
Estado de Energia: LIGADO
Botão: RESET (traseiro ou lateral)
Duração: 7+ segundos
Indicador: LED de energia muda de cor ou padrão
Ação: Solte quando o LED indicar modo de redefinição de fábrica
```

### Modos de Reset Avançados

**Funções de Reset do RouterBOARD/MikroTik**:
- **3 segundos**: Carregar bootloader de backup
- **Segurar até o LED piscar**: Restaurar configuração padrão
- **+5 segundos (LED fixo)**: Ativar modo CAPs
- **+5 segundos adicionais (LED apagado)**: Modo Netinstall

## Procedimentos de Recuperação via TFTP

### Configuração da Recuperação TFTP

**Pré-requisitos**:
- **Software de servidor TFTP**: PumpKIN (Windows), tftpd (Linux/macOS)
- **Firmware de recuperação**: Imagem de firmware de fábrica apropriada
- **Configuração de rede**: IP estático na sub-rede do roteador
- **Conexão direta**: Cabo Ethernet entre o computador e o roteador

**Configuração de Rede**:
```
IP do Computador: 192.168.0.66 (ou 192.168.1.66)
Máscara de Sub-rede: 255.255.255.0
Gateway: (deixar em branco)
IP do Roteador: 192.168.0.1 (ou 192.168.1.1)
```

### Execução da Recuperação TFTP

**Processo Padrão de Recuperação TFTP**:

1. **Prepare o servidor TFTP**:
   - Instale e configure o software de servidor TFTP
   - Coloque o firmware de recuperação no diretório raiz do TFTP
   - Inicie o serviço TFTP

2. **Configure a rede**:
   - Defina o IP do computador para a sub-rede apropriada
   - Desative temporariamente o firewall
   - Certifique-se de que não há outros servidores DHCP ativos

3. **Inicie o modo de recuperação**:
   - Desligue o roteador completamente
   - Pressione e segure o botão de reset com firmeza
   - Aplique energia enquanto continua segurando o reset
   - Observe a solicitação TFTP nos logs do servidor

4. **Transferência do arquivo**:
   - O roteador solicita um nome de arquivo específico (geralmente "recovery.bin")
   - O servidor TFTP transfere o firmware automaticamente
   - Aguarde a conclusão da transferência (geralmente 30-60 segundos)

5. **Instalação**:
   - O roteador grava o firmware internamente
   - Aguarde 2-5 minutos para a instalação
   - O dispositivo reinicia com o firmware de fábrica

### Procedimentos TFTP Específicos por Marca

**Recuperação TFTP da TP-Link**:
```
Nome do Firmware: "recovery.bin" (renomeie seu arquivo de firmware)
IP do Roteador: 192.168.0.1
IP do Computador: 192.168.0.66
Segurar Reset: Durante a inicialização até a transferência começar
Duração Esperada: 30-45 segundos de transferência, 2-3 minutos no total
```

**Recuperação TFTP da Ubiquiti**:
```
Nome do Firmware: Nome do arquivo original do firmware Ubiquiti
IP do Roteador: 192.168.1.20
IP do Computador: 192.168.1.xxx (não .20)
Segurar Reset: 20+ segundos durante a inicialização
Padrão de LED: Padrão alternado de 2 LEDs piscando indica pronto
```

**Recuperação TFTP da Netgear**:
```
Nome do Firmware: "recovery.img" ou nome específico do dispositivo
IP do Roteador: 192.168.1.1
IP do Computador: 192.168.1.2
Segurar Reset: Durante a inicialização até o LED de energia ficar âmbar
Indicador: LED de energia âmbar indica modo TFTP ativo
```

## Recuperação via Console Serial

### Quando Usar o Console Serial

**A recuperação via console serial é necessária quando**:
- A recuperação TFTP falha
- O bootloader está corrompido
- Não há conectividade de rede disponível
- É necessário depuração avançada

> **⚠️ Procedimento Avançado**: A recuperação via console serial requer modificação de hardware e habilidades técnicas avançadas. Prossiga apenas se estiver confortável com trabalhos de eletrônica.

### Configuração do Hardware do Console Serial

*`[Serial Console Hookup](router-serial-console.png)` — Foto ou diagrama de conexão dos cabos seriais para recuperação avançada, mostrando os pontos de conexão e o roteamento dos cabos.*

**Equipamento Necessário**:
- **Adaptador USB-para-TTL**: Níveis lógicos de 3.3V (NÃO RS232)
- **Fios jumper**: Fêmea-para-macho ou conectores apropriados
- **Equipamento de solda**: Se for necessária a instalação de pinos (header)
- **Multímetro**: Para verificação de voltagem

**Mapeamento das Conexões**:
```
Roteador          Adaptador USB-TTL
GND     <--->   GND
TX      <--->   RX
RX      <--->   TX
VCC     <--->   (geralmente não conectado)
```

> **🔌 Aviso de Voltagem**: Certifique-se de que o adaptador USB-TTL opera em 3.3V. Níveis de 5V podem danificar permanentemente o circuito do roteador.

### Acesso ao Console Serial

**Configuração do Software**:
- **Baud Rate**: 115200 (mais comum)
- **Data Bits**: 8
- **Paridade**: Nenhuma
- **Stop Bits**: 1
- **Controle de Fluxo**: Nenhum

**Opções de Software de Terminal**:
- **Windows**: PuTTY, TeraTerm
- **macOS**: Screen, Minicom
- **Linux**: Minicom, Screen, Picocom

**Comandos de Conexão**:
```bash
# Linux/macOS
screen /dev/ttyUSB0 115200

# Alternative Linux
minicom -D /dev/ttyUSB0 -b 115200

# Windows (use PuTTY GUI or)
putty -serial COM3 -sercfg 115200,8,n,1,N
```

### Intervenção no Bootloader

**Prompts Comuns de Bootloader**:
- **U-Boot**: "Hit any key to stop autoboot"
- **CFE**: prompt "CFE>"
- **RedBoot**: prompt "RedBoot>"

**Comandos Típicos de Recuperação**:
```bash
# U-Boot TFTP recovery
setenv ipaddr 192.168.1.1
setenv serverip 192.168.1.100
tftp 0x80060000 firmware.bin
erase 0x9f020000 +0x7e0000
cp.b 0x80060000 0x9f020000 $filesize
bootm 0x9f020000

# Reset environment variables
env default -a
saveenv
reset
```

## Procedimentos de Restauração de Firmware

### Restaurando o Firmware Original

*`[Restoring Firmware Process](restoring-firmware.png)` — Série ou diagrama mostrando as etapas de recuperação de uma instalação com falha, incluindo conexões de cabos e capturas de tela da interface.*

**Quando Restaurar o Firmware Original**:
- Falha na instalação do LibreMesh
- Problemas de desempenho do dispositivo
- Considerações de garantia
- Venda/devolução do dispositivo

**Prioridade dos Métodos de Restauração**:
1. **Atualização via interface web**: Se o LibreMesh/OpenWrt ainda estiver acessível
2. **Recuperação TFTP**: Usando o firmware de fábrica original
3. **Console serial**: Para problemas graves no bootloader
4. **Assistência profissional**: Se os métodos acima falharem

### Obtenção do Firmware Original

**Fontes Oficiais**:
- **Site do fabricante**: Seção de downloads/suporte
- **Página do modelo do dispositivo**: Firmware exato para a sua revisão
- **Correspondência de versão**: Garanta que o firmware corresponda exatamente à revisão do hardware

**Seleção do Firmware**:
- **Firmware de fábrica**: Para restauração completa
- **Firmware de recuperação**: Versões mínimas especiais para TFTP
- **Versões regionais**: Correspondam à região do firmware original, se especificado

## Diagnóstico de Problemas Comuns

### Análise dos Padrões de LED

**Padrões Normais de Inicialização**:
- **Ao ligar**: Todos os LEDs acendem brevemente
- **Processo de boot**: Ativação sequencial dos LEDs
- **Operação normal**: LEDs de energia, wireless e ethernet acesos de forma estável

**Indicadores de Problemas**:
- **Todos os LEDs apagados**: Falha na fonte de alimentação
- **Apenas LED de energia**: Falha no boot, tente o reset
- **Piscadas rápidas**: Geralmente indica modo de recuperação
- **Padrões alternados**: Pode indicar modo TFTP
- **Loops contínuos de boot**: Firmware corrompido

### Testes de Conectividade de Rede

**Verificação Básica de Conectividade**:
```bash
# Check network interface status
ip link show                    # Linux
ipconfig /all                   # Windows
ifconfig -a                     # macOS

# Test router connectivity
ping 192.168.1.1
ping 192.168.0.1
ping thisnode.info

# Check routing table
ip route                        # Linux
route print                     # Windows
netstat -rn                     # macOS

# Scan for devices
nmap -sn 192.168.1.0/24        # Common router subnet
arp -a                          # Show known devices
```

### Problemas de Memória e Desempenho

**Sintomas de Memória Insuficiente**:
- Resposta lenta da interface web
- Tempo limite de conexão excedido
- Falhas de serviços
- Incapacidade de instalar pacotes

**Diagnóstico de Memória**:
```bash
# Check available memory
free -h
cat /proc/meminfo

# Check flash usage
df -h
du -sh /overlay/*

# Monitor running processes
top
ps aux
```

## Prevenção e Manutenção

### Precauções Antes do Flash

**Antes de Qualquer Instalação de Firmware**:
- [ ] **Verifique a estabilidade da energia**: Use um UPS (no-break), se disponível
- [ ] **Verifique a compatibilidade do firmware**: Correspondência exata de modelo/revisão
- [ ] **Faça backup do firmware atual**: Se houver caminho de atualização disponível
- [ ] **Leia as notas de instalação**: Requisitos específicos do dispositivo
- [ ] **Prepare as ferramentas de recuperação**: Servidor TFTP, adaptador serial
- [ ] **Documente as configurações atuais**: Backup da configuração de rede

### Práticas de Manutenção Regular

**Manutenção Mensal**:
- **Verifique os logs do sistema**: Revise erros ou avisos
- **Monitore o uso de memória**: Garanta espaço livre suficiente
- **Verifique a conectividade da mesh**: Teste os caminhos da rede
- **Atualize as chaves de segurança**: Troque as senhas, se necessário

**Manutenção Trimestral**:
- **Atualizações de firmware**: Verifique novos lançamentos do LibreMesh
- **Backup da configuração**: Salve as configurações atuais
- **Testes de desempenho**: Verificações de largura de banda e latência
- **Inspeção física**: Verifique superaquecimento ou danos
## Informações de Contato de Emergência

### Recursos de Suporte da Comunidade

**Comunidade LibreMesh**:
- **Lista de Discussão**: lime-users@lists.libremesh.org
- **Canal IRC**: #libremesh em oftc.net
- **Fórum**: Discussões da comunidade e solução de problemas

**Comunidade OpenWrt**:
- **Fórum**: https://forum.openwrt.org/
- **Wiki**: Guias de solução de problemas específicos por dispositivo
- **Listas de desenvolvedores**: Questões técnicas de implementação

### Serviços Profissionais de Recuperação

**Quando Buscar Ajuda Profissional**:
- Modificação de hardware necessária (soldagem)
- Corrupção do bootloader além da recuperação serial
- Implantação crítica com prazo limitado
- Cobertura de seguro/garantia disponível

## Verificação do Sucesso da Recuperação

### Lista de Verificação Pós-Recuperação

Após qualquer procedimento de recuperação:

- [ ] **Roteador responde**: Interface web ou SSH acessível
- [ ] **Conectividade de rede**: Acesso à internet restaurado
- [ ] **Todas as interfaces funcionais**: Sem fio e ethernet funcionando
- [ ] **Padrões de LED normais**: Indicadores operacionais padrão
- [ ] **Desempenho aceitável**: Sem problemas óbvios de velocidade/estabilidade
- [ ] **Configuração restaurada**: Configurações correspondem aos requisitos

### Monitoramento de Longo Prazo

**Monitore Problemas Recorrentes**:
- **Estabilidade do sistema**: Tempo de atividade e frequência de travamentos
- **Tendências de uso de memória**: Consumo crescente de memória
- **Desempenho da rede**: Mudanças de largura de banda e latência
- **Análise de logs**: Padrões de erros repetidos

> **📋 Documentação**: Mantenha registros detalhados de todos os procedimentos de solução de problemas e seus resultados. Essas informações são valiosas para evitar problemas futuros e ajudar membros da comunidade com problemas semelhantes.

## Guias Relacionados

- **[Guia de Seleção de Roteador](router-selection-guide.md)**: Escolha o hardware adequado para minimizar problemas
- **[Guia de Instalação do LibreMesh](libremesh-installation.md)**: Procedimentos adequados de instalação para evitar problemas
- **Configuração do LibreMesh**: Configuração avançada para otimizar o desempenho