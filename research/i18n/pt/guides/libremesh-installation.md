---
title: Instalação
sourcePath: guides/libremesh-installation.md
sourceHash: 1170d67029ff662a
translatedBy: glm-4.6
---

# Guia de Instalação do Firmware LibreMesh

Este guia abrangente fornece instruções passo a passo para baixar, verificar, preparar e gravar o firmware LibreMesh no seu roteador de destino. Siga estes procedimentos com cuidado para garantir uma instalação bem-sucedida e evitar danos ao dispositivo.

## Requisitos Pré-Instalação

### Preparação de Hardware
- **Roteador**: Dispositivo compatível do [Guia de Seleção de Roteador](router-selection-guide.md)
- **Computador**: Máquina com Windows, macOS ou Linux com porta Ethernet
- **Cabo Ethernet**: Cabo Cat5e ou Cat6 para conexão com fio
- **Fonte de alimentação**: Adaptador de energia original do roteador
- **Ferramentas**: Clipe de papel ou similar para o botão de reset (se necessário)

### Requisitos de Software
- **Navegador web**: Chrome, Firefox, Safari ou Edge
- **Cliente TFTP**: Para situações de recuperação (PumpKIN, Tftpd64 ou embutido)
- **Terminal/Prompt de comando**: Para diagnóstico de rede

> **⚠️ Aviso de Segurança**: A instalação de firmware envolve risco de dano ao dispositivo ("brickamento"). Garanta uma fonte de alimentação estável e siga as instruções com precisão. Nunca interrompa o processo de gravação.

## Passo 1: Baixar o Firmware LibreMesh

### Encontrando o Firmware do Seu Roteador

*`[Firmware Selector Screenshot](libremesh-download-page.png)` — Ferramenta LibreMesh Firmware Selector para encontrar o firmware correto.*

1. **Visite o LibreMesh Firmware Selector**: https://firmware-selector.libremesh.org/
2. **Navegue até a categoria do seu roteador**: Navegue por fabricante (TP-Link, GL.iNet, Asus, etc.)
3. **Localize o modelo e a revisão exatos**: Correspondência precisa com o seu dispositivo
4. **Escolha o tipo de firmware**:
   - **`-factory.bin`**: Para roteadores com firmware de fábrica/original
   - **`-sysupgrade.bin`**: Para roteadores já executando OpenWrt/LibreMesh

### Verificação do Firmware

> **🔒 Melhor Prática de Segurança**: Sempre verifique a integridade do firmware antes da instalação para evitar que firmware corrompido ou malicioso danifique seu dispositivo.

**Baixe os arquivos de verificação** junto com o seu firmware:
- **Arquivo de checksum SHA256**: Geralmente nomeado `sha256sums`
- **Assinatura GPG**: Frequentemente `sha256sums.gpg` para verificação de autenticidade

**Verifique o checksum (Linux/macOS)**:
```bash
sha256sum -c sha256sums
```

**Verifique o checksum (Windows)**:
```powershell
Get-FileHash -Algorithm SHA256 filename.bin
```

**Compare a saída** com o valor no arquivo de checksum. Eles devem corresponder exatamente.

> **💡 Dica**: Se os checksums não corresponderem, baixe o firmware novamente. Nunca instale firmware com checksums não correspondentes.

## Passo 2: Preparar Sua Conexão de Rede

### Configuração de Rede do Computador

1. **Desative conexões sem fio**: Desligue o Wi-Fi para evitar conflitos de roteamento
2. **Configure IP estático**: Defina a interface Ethernet do seu computador para corresponder à sub-rede do roteador
   - **Endereço IP**: 192.168.1.100 (ou 192.168.0.100)
   - **Máscara de Sub-rede**: 255.255.255.0
   - **Gateway**: Deixe em branco por enquanto

### Configuração da Conexão Física

*`[Ethernet Connection Preparation](ethernet-cable-setup.png)` — Usuário conectando o cabo LAN entre o computador e o roteador para a gravação, mostrando o roteamento adequado do cabo e os pontos de conexão.*

1. **Desligue o roteador**: Desconecte completamente o adaptador de energia
2. **Conecte o cabo Ethernet**: Do computador à porta LAN do roteador (não WAN)
3. **Verifique a qualidade do cabo**: Certifique-se de que o cabo não está danificado e as conexões estão seguras
4. **Ligue o roteador**: Conecte o adaptador de energia e aguarde a conclusão da inicialização

### Métodos de Acesso ao Roteador

**Para Roteadores com Firmware de Fábrica**:
- **Endereços comuns**: 192.168.1.1 ou 192.168.0.1
- **Verifique a etiqueta do roteador**: O IP padrão geralmente está impresso no adesivo do dispositivo
- **Credenciais de login**: Geralmente admin/admin ou admin/(em branco)

**Para Roteadores OpenWrt**:
- **Endereço padrão**: 192.168.1.1
- **Login padrão**: root com senha em branco (se não configurado)

**Para Roteadores LibreMesh**:
- **Endereço mágico**: http://thisnode.info
- **Alternativa**: 10.13.0.1 ou IP de gateway configurado

## Passo 3: Acessar a Interface Web do Roteador

### Solução de Problemas de Conexão

Se você não conseguir acessar a interface web do roteador:

**Verifique a conectividade de rede**:
```bash
# Test basic connectivity
ping 192.168.1.1
ping 192.168.0.1

# Check routing table
ip route show default    # Linux
route print             # Windows
netstat -rn             # macOS
```

**Encontre o IP do roteador automaticamente**:
```bash
# Linux/macOS - scan common subnets
nmap -sn 192.168.1.0/24
nmap -sn 192.168.0.0/24

# Windows - check ARP table
arp -a
```

**Soluções comuns**:
- **Verifique a conexão do cabo**: Tente portas Ethernet diferentes
- **Verifique a fonte de alimentação**: Certifique-se de que o roteador está totalmente energizado e inicializado
- **Redefina o roteador**: Use o reset de hardware se a configuração estiver corrompida
- **Tente um navegador diferente**: Alguns roteadores têm problemas de compatibilidade com navegadores

## Passo 4: Gravar o Firmware LibreMesh

### Gravação Padrão Via Web

*`[Router in Flash Mode](router-flash-mode.png)` — Roteador com LEDs ou indicadores físicos sinalizando o modo de gravação de firmware, mostrando padrões típicos de LED durante o upload do firmware.*

1. **Navegue até a seção de atualização de firmware**:
   - **TP-Link**: Avançado → Ferramentas do Sistema → Atualização de Firmware
   - **Asus**: Administração → Atualização de Firmware
   - **GL.iNet**: Sistema → Atualizar
   - **OpenWrt Genérico**: Sistema → Backup/Gravar Firmware

2. **Envie o arquivo de firmware**:
   - **Clique em "Escolher Arquivo"** ou "Procurar"
   - **Selecione seu arquivo `-factory.bin`**
   - **Verifique o nome do arquivo** correspondência exata com o seu roteador

3. **Verificações importantes antes da gravação**:
   - [ ] Arquivo de firmware correto selecionado
   - [ ] Fonte de alimentação estável confirmada
   - [ ] Nenhuma outra atividade de rede no roteador
   - [ ] Backup da configuração atual (se desejado)

4. **Inicie o processo de gravação**:
   - **Clique em "Gravar" ou "Atualizar"**
   - **NÃO desligue** nem desconecte durante o processo
   - **Aguarde a conclusão** (normalmente 3-5 minutos)

### Procedimentos Específicos por Marca

**Bypass do Bloqueio FCC da TP-Link** (para modelos mais recentes):
1. **Instale o DD-WRT primeiro**: Use a versão apropriada do DD-WRT US
2. **Volte para o estado de fábrica**: Baixe o firmware oficial de reversão
3. **Renomeie o firmware LibreMesh**: Correspondência exata com a convenção de nomenclatura da TP-Link
4. **Grave via interface de fábrica**: Envie o firmware LibreMesh renomeado

**Considerações para Ubiquiti AirOS**:
> **⚠️ Aviso Crítico**: O AirOS 5.6.x brickará seu dispositivo. Faça o downgrade para o AirOS 5.5.x primeiro usando o firmware oficial dos downloads da Ubiquiti.

**Dispositivos GL.iNet**:
- **Use a recuperação U-Boot**: Se a interface web falhar
- **Verifique as chaves de hardware**: Alguns modelos têm chaves de seleção de firmware

## Passo 5: Verificação Pós-Instalação

### Teste Inicial de Conexão

Após a conclusão da instalação do firmware:

1. **Aguarde a reinicialização do roteador**: Permita 2-3 minutos para a inicialização completa
2. **Reconfigure a rede do computador**: Defina para DHCP ou IP estático apropriado
3. **Acesse a interface LibreMesh**: Navegue até http://thisnode.info

### Configuração Inicial

**Defina a Senha do Administrador**:
> **🔒 Crítico para Segurança**: Sempre defina uma senha de administrador forte imediatamente após a instalação.

1. **Navegue até as configurações de senha**: Geralmente solicitado no primeiro acesso
2. **Escolha uma senha forte**: Mínimo de 12 caracteres com maiúsculas, minúsculas, números e símbolos
3. **Salve a configuração**: Aplique as configurações e aguarde o recarregamento

**Verificação Básica de Rede**:
```bash
# Test connectivity to LibreMesh node
ping thisnode.info

# Check mesh network advertisement
iwinfo wlan0 scan | grep LibreMesh

# Verify network interfaces
ip addr show
```

### Etapas Essenciais Pós-Instalação

1. **Atualize os pacotes do sistema**:
   ```bash
   opkg update
   opkg list-upgradable
   ```

2. **Configure a sincronização de tempo**:
   - **Defina o fuso horário**: Sistema → Sistema → Configurações Gerais
   - **Ative o NTP**: Rede → Sincronização de Tempo

3. **Configure a rede mesh**:
   - **Defina o nome da rede**: Personalize a partir do padrão "LibreMesh.org"
   - **Configure os canais**: Otimize para o ambiente de RF local
   - **Defina a chave mesh**: Ative a criptografia para o backhaul mesh

## Passo 6: Integração de Rede

### Configuração do Gateway de Internet

**Conecte a interface WAN**:
1. **Conexão física**: Fonte de internet à porta WAN do roteador
2. **Configure o protocolo**: DHCP, PPPoE ou estático conforme necessário
3. **Teste a conectividade**: Verifique o acesso à internet através da mesh

**Configure as funções das portas** (para dispositivos de porta única):
```bash
# Set specific port as WAN
uci set network.wan.ifname='eth0.2'
uci commit network
service network restart
```

### Entrada na Rede Mesh

**Descoberta automática da mesh**:
- Os nós LibreMesh descobrem vizinhos automaticamente
- **Verifique os links mesh**: Rede → Status da Mesh
- **Verifique as tabelas de roteamento**: Avançado → Status → Rotas

**Configuração manual da mesh** (se necessário):
```bash
# Set mesh ID and key
uci set lime.wifi.ap_ssid='YourNetworkName'
uci set lime.wifi.adhoc_ssid='YourMeshName_mesh'
uci commit lime
lime-config
reboot
```
## Solução de Problemas de Instalação

### Falha na Recuperação de Flash

Se a instalação do firmware falhar:

1. **Não entre em pânico**: A maioria dos roteadores possui mecanismos de recuperação
2. **Tente a recuperação via TFTP**: Consulte o [Guia de Solução de Problemas do Roteador](router-troubleshooting.md)
3. **Use redefinição de hardware**: Mantenha o botão de reset pressionado durante a inicialização
4. **Recuperação via console serial**: Último recurso para usuários avançados

### Problemas Comuns de Instalação

**Erros de "Firmware Inválido"**:
- **Verifique o nome do arquivo do firmware**: Deve corresponder ao formato esperado
- **Verifique modelo/revisão**: Garanta a compatibilidade exata com o hardware
- **Tente um método de upload diferente**: Interface web vs TFTP

**O Processo de Flash Travou**:
- **Desligue e ligue o roteador**: Tente o modo de recuperação
- **Verifique a conectividade de rede**: Garanta uma conexão estável
- **Reduza o tráfego de rede**: Feche outros aplicativos

**Roteador Sem Resposta Após o Flash**:
- **Espere mais tempo**: Alguns roteadores precisam de 5+ minutos para a primeira inicialização
- **Verifique os padrões dos LEDs**: Compare com a sequência normal de inicialização
- **Tente a redefinição de fábrica**: Procedimento com o botão de reset de hardware

## Lista de Verificação

Após a instalação bem-sucedida do LibreMesh:

- [ ] **Senha de administrador definida**: Senha forte configurada
- [ ] **Conectividade de rede**: Acesso à internet através da mesh
- [ ] **Interface web acessível**: http://thisnode.info carrega
- [ ] **Rede mesh ativa**: Outros nós visíveis no status da mesh
- [ ] **Redes sem fio transmitindo**: SSIDs de cliente e mesh
- [ ] **Hora do sistema sincronizada**: Fuso horário e NTP corretos
- [ ] **Serviços básicos em execução**: SSH, interface web, protocolos mesh

## Próximos Passos

Com o LibreMesh instalado com sucesso:

1. **Consulte o [Guia de Solução de Problemas do Roteador](router-troubleshooting.md)** para procedimentos de manutenção
2. **Planeje nós adicionais**: Expanda a cobertura da rede mesh
3. **Configure recursos avançados**: QoS, portal cativo, monitoramento
4. **Participe do suporte da comunidade**: Listas de discussão e fóruns para ajuda contínua

> **📚 Recursos Adicionais**: 
> - Documentação de Configuração do LibreMesh: https://libremesh.org/docs/
> - Gerenciamento de Pacotes do OpenWrt: https://openwrt.org/docs/guide-user/additional-software/opkg
> - Fóruns de Suporte da Comunidade: https://libremesh.org/communication.html