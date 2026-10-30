---
title: Armazenamento Externo
sourcePath: guides/external-storage.md
sourceHash: d3eeb09683b95b52
translatedBy: glm-4.6
---

# Guia de Armazenamento Externo para Expansão de Servidor Comunitário

Este guia cobre a conexão, formatação e montagem de dispositivos de armazenamento adicionais (USB, SATA, SSD) para expandir capacidade e melhorar a resiliência de dados em implantações de servidores comunitários.

## Entendendo as Opções de Armazenamento Externo

O armazenamento externo oferece capacidades cruciais para servidores comunitários:

- **Expansão de Capacidade**: Adicionar armazenamento sem substituir discos existentes
- **Redundância de Dados**: Criar cópias de backup em dispositivos físicos separados
- **Melhoria de Desempenho**: Usar SSDs para cargas de trabalho de alto desempenho
- **Arquitetura Modular**: Adição e remoção fácil de armazenamento conforme as necessidades mudam

### Tipos de Conexão de Armazenamento

| Tipo de Conexão | Velocidade | Melhor Caso de Uso | Compatibilidade |
|----------------|-------|---------------|---------------|
| USB 3.0/3.1 | 5-10 Gbps | Discos de backup, armazenamento portátil | Universal |
| USB-C | Até 40 Gbps | SSDs externos de alta velocidade | Sistemas modernos |
| eSATA | 6 Gbps | Armazenamento externo permanente | Sistemas desktop |
| Thunderbolt | Até 40 Gbps | Cargas de trabalho profissionais | Mac/PC de alto desempenho |
| SATA Interno | 6 Gbps | Expansão de armazenamento primário | Desktop/servidor |

## Preparação Pré-Conexão

### Inventarie o Armazenamento Atual

Antes de adicionar armazenamento externo, documente sua configuração atual:

```bash
# List all block devices
lsblk

# Show disk usage
df -h

# Display detailed disk information
sudo fdisk -l
```

### Verifique as Portas Disponíveis

Identifique as portas de conexão disponíveis:
- Portas USB 3.0+ (normalmente conectores azuis)
- Portas eSATA
- Conexões SATA internas
- Requisitos de energia para discos de 3,5"

> **⚠️ Requisitos de Energia**
> 
> Discos SATA de 3,5" requerem conexões de energia separadas. Discos de 2,5" normalmente podem ser alimentados via USB. Planeje sua infraestrutura de energia de acordo.

## Passo 1: Conexão Física

### Conexão de Disco USB

`[Mounting External Drive](mounting-external-drive.png)`

1. **Localize a porta USB apropriada** (USB 3.0+ recomendado para melhor desempenho)
2. **Conecte o disco** garantindo uma conexão segura
3. **Para adaptadores USB-SATA**: Conecte os cabos USB e de energia, se necessário
4. **Aguarde o reconhecimento** (normalmente 5-10 segundos)

### Conexão de Disco SATA

Para conexões SATA internas:

1. **Desligue o sistema completamente**
2. **Conecte o cabo de dados SATA** à porta SATA da placa-mãe
3. **Conecte o cabo de energia SATA** da fonte de alimentação
4. **Fixe o disco no suporte de montagem** se for instalação permanente
5. **Ligue e verifique BIOS/UEFI** para o reconhecimento do disco

### Verificação da Conexão Física

```bash
# Check system messages for new device
dmesg | tail -20

# List all SCSI/SATA devices
lsscsi

# Monitor real-time device detection
sudo tail -f /var/log/syslog
```

## Passo 2: Detecção e Identificação do Disco

### Detecção Automática

A maioria dos sistemas Linux detecta automaticamente novos dispositivos de armazenamento:

```bash
# List all block devices with file system info
lsblk -f

# Show all storage devices
sudo fdisk -l

# Display device information by ID
ls -la /dev/disk/by-id/
```

### Varredura Manual de Dispositivos

Se a detecção automática falhar:

```bash
# Rescan SCSI devices
echo "- - -" | sudo tee /sys/class/scsi_host/host*/scan

# Rescan specific SCSI host (replace X with host number)
echo "1" | sudo tee /sys/class/block/sdX/device/rescan
```

### Identificando seu Novo Disco

Procure o novo dispositivo na saída:

```bash
# Example output showing new USB drive
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   10G  0 disk 
├─sda1   8:1    0    1G  0 part /boot
└─sda2   8:2    0    9G  0 part /
sdb      8:16   1  7.4G  0 disk  ← New USB drive
```

## Passo 3: Preparação e Formatação do Disco

### Verifique o Sistema de Arquivos Existente

Antes de formatar, verifique se o disco já contém dados:

```bash
# Check for existing file systems
sudo blkid /dev/sdb

# Attempt to identify file system type
sudo file -s /dev/sdb1
```

### Crie Tabela de Partições (se necessário)

Para discos completamente novos:

```bash
# Create GPT partition table (recommended for drives >2TB)
sudo parted /dev/sdb mklabel gpt

# Or create MBR partition table (for compatibility)
sudo parted /dev/sdb mklabel msdos
```

### Crie Partições

#### Usando parted (recomendado)

```bash
# Start parted on the new drive
sudo parted /dev/sdb

# Create a single partition using all available space
(parted) mkpart primary ext4 0% 100%

# Exit parted
(parted) quit
```

#### Usando fdisk

```bash
# Start fdisk
sudo fdisk /dev/sdb

# Create new partition (n), primary (p), partition 1, accept defaults
# Write changes (w)
```

### Formate a Partição

`[Filesystem Format Screenshot](format-drive-ui.png)`

Escolha o sistema de arquivos apropriado conforme suas necessidades:

#### ext4 (Recomendado para Linux)

```bash
# Format with ext4 file system
sudo mkfs.ext4 /dev/sdb1

# Format with label for easy identification
sudo mkfs.ext4 -L "backup-storage" /dev/sdb1
```

#### NTFS (para compatibilidade com Windows)

```bash
# Install NTFS tools if not available
sudo apt install ntfs-3g

# Format with NTFS
sudo mkfs.ntfs -f -L "shared-storage" /dev/sdb1
```

#### exFAT (compatibilidade multiplataforma)

```bash
# Install exFAT tools
sudo apt install exfat-fuse exfat-utils

# Format with exFAT
sudo mkfs.exfat -n "portable-storage" /dev/sdb1
```

### Verifique a Formatação

```bash
# Check the new file system
sudo blkid /dev/sdb1

# Verify file system integrity
sudo fsck /dev/sdb1
```

## Passo 4: Montando o Armazenamento Externo

### Crie o Ponto de Montagem

```bash
# Create directory for mount point
sudo mkdir -p /mnt/external-storage

# Or use a more descriptive path
sudo mkdir -p /srv/backup-storage
```

### Montagem Temporária

Para testes ou acesso temporário:

```bash
# Mount the drive
sudo mount /dev/sdb1 /mnt/external-storage

# Verify mount
df -h | grep external-storage

# Check mount details
mount | grep sdb1
```

### Montagem Permanente

Para montagem automática na inicialização, edite o `/etc/fstab`:

#### Obtenha o UUID do Disco

```bash
# Find the UUID of your partition
sudo blkid /dev/sdb1
# Output: /dev/sdb1: UUID="12345678-1234-1234-1234-123456789012" TYPE="ext4" LABEL="backup-storage"
```

#### Edite o fstab

```bash
# Backup current fstab
sudo cp /etc/fstab /etc/fstab.backup

# Edit fstab
sudo nano /etc/fstab
```

Adicione uma linha para seu novo disco:

```
# External backup storage
UUID=12345678-1234-1234-1234-123456789012 /srv/backup-storage ext4 defaults,nofail 0 2
```

#### Opções do fstab Explicadas

- `defaults`: Usa as opções de montagem padrão
- `nofail`: Não falha na inicialização se o disco estiver ausente[20]
- `0`: Não faz dump deste sistema de arquivos
- `2`: Verifica o sistema de arquivos após a partição raiz

#### Teste a Entrada do fstab

```bash
# Test mount all entries in fstab
sudo mount -a

# Verify successful mount
df -h
```

## Passo 5: Configurando Permissões e Propriedade

### Permissões Básicas

```bash
# Set appropriate ownership
sudo chown -R $USER:$USER /srv/backup-storage

# Set permissions for user access
sudo chmod 755 /srv/backup-storage
```

### Acesso Baseado em Grupos

Para ambientes de servidor multiusuário:

```bash
# Create a group for storage access
sudo groupadd storage-users

# Add users to the group
sudo usermod -a -G storage-users username1
sudo usermod -a -G storage-users username2

# Set group ownership
sudo chgrp -R storage-users /srv/backup-storage

# Set group write permissions
sudo chmod -R 775 /srv/backup-storage
```

## Opções de Configuração Avançada

### Otimização de Desempenho

#### Opções de Montagem para SSDs

Para discos externos SSD, use opções de montagem otimizadas:

```
UUID=12345678-1234-1234-1234-123456789012 /srv/ssd-storage ext4 defaults,noatime,discard,nofail 0 2
```

- `noatime`: Não atualiza tempos de acesso (melhora o desempenho)
- `discard`: Habilita comandos TRIM para a saúde do SSD

#### Agendamento de E/S

Para discos externos, considere os agendadores deadline ou noop:

```bash
# Check current scheduler
cat /sys/block/sdb/queue/scheduler

# Set deadline scheduler for external drive
echo deadline | sudo tee /sys/block/sdb/queue/scheduler
```

### Configuração de Criptografia

Para dados sensíveis, use criptografia LUKS:

```bash
# Install encryption tools
sudo apt install cryptsetup

# Create encrypted container
sudo cryptsetup luksFormat /dev/sdb1

# Open encrypted device
sudo cryptsetup luksOpen /dev/sdb1 encrypted-storage

# Format the encrypted device
sudo mkfs.ext4 /dev/mapper/encrypted-storage

# Mount encrypted device
sudo mkdir /mnt/encrypted-storage
sudo mount /dev/mapper/encrypted-storage /mnt/encrypted-storage
```

## Monitoramento da Saúde do Disco

### Monitoramento S.M.A.R.T.

```bash
# Install smartmontools
sudo apt install smartmontools

# Check drive health
sudo smartctl -H /dev/sdb

# Full S.M.A.R.T. information
sudo smartctl -a /dev/sdb

# Run short self-test
sudo smartctl -t short /dev/sdb
```

### Verificações Regulares de Saúde

Crie um script de monitoramento:

```bash
#!/bin/bash
# External drive health check script

DRIVE="/dev/sdb"
LOG_FILE="/var/log/external-drive-health.log"

echo "$(date): Checking drive health for $DRIVE" >> $LOG_FILE
sudo smartctl -H $DRIVE >> $LOG_FILE 2>&1

# Check mount status
if mountpoint -q /srv/backup-storage; then
    echo "$(date): Drive mounted successfully" >> $LOG_FILE
else
    echo "$(date): WARNING - Drive not mounted" >> $LOG_FILE
fi
```

## Estratégias de Backup e Redundância

### Scripts de Backup Automatizado

```bash
#!/bin/bash
# Simple backup script for external storage

SOURCE_DIR="/srv/data"
BACKUP_DIR="/srv/backup-storage/daily-backup"
DATE=$(date +%Y%m%d)

# Create dated backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Perform incremental backup using rsync
rsync -av --link-dest="$BACKUP_DIR/latest" \
      "$SOURCE_DIR/" "$BACKUP_DIR/$DATE/"

# Update latest symlink
ln -nfs "$DATE" "$BACKUP_DIR/latest"

echo "Backup completed: $(date)" >> /var/log/backup.log
```

### Configuração de RAID

Para múltiplos discos externos, considere RAID por software:

```bash
# Install mdadm
sudo apt install mdadm

# Create RAID 1 mirror with two drives
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# Format and mount RAID array
sudo mkfs.ext4 /dev/md0
sudo mkdir /srv/raid-storage
sudo mount /dev/md0 /srv/raid-storage
```

## Solução de Problemas Comuns

### Disco Não Detectado

1. **Verifique as conexões físicas**
2. **Verifique a fonte de alimentação** (especialmente para discos de 3,5")
3. **Experimente outra porta USB** ou cabo
4. **Verifique os logs do sistema**:
   ```bash
   dmesg | grep -i error
   sudo journalctl -f
   ```

### Falhas de Montagem

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Force mount with specific type
sudo mount -t ext4 /dev/sdb1 /mnt/external-storage

# Check for conflicting mounts
mount | grep sdb1
```

### Problemas de Permissão

```bash
# Fix ownership issues
sudo chown -R $USER:$USER /mnt/external-storage

# Check SELinux contexts (if applicable)
ls -Z /mnt/external-storage
```

### Problemas de Desempenho

```bash
# Check I/O statistics
iostat 5

# Monitor disk usage
iotop

# Test read/write performance
sudo hdparm -tT /dev/sdb
```

## Considerações de Segurança

### Controle de Acesso

1. **Limite os pontos de montagem** apenas aos diretórios necessários
2. **Use a opção noexec** para partições somente de dados
3. **Auditorias regulares de permissões**:
   ```bash
   find /srv/backup-storage -type f -perm 777
   ```

### Proteção de Dados

1. **Criptografe o armazenamento externo sensível**
2. **Verificação regular de backups**
3. **Descarte seguro** de discos antigos
4. **Registro de acesso**:
   ```bash
   # Monitor file access
   tail -f /var/log/audit/audit.log | grep external-storage
   ```

## Integração com Serviços do Servidor

### Integração com Servidor Web

```bash
# Create web-accessible storage directory
sudo mkdir -p /srv/backup-storage/web-data
sudo chown -R www-data:www-data /srv/backup-storage/web-data

# Add to web server configuration
# Apache example:
# Alias /backup-data /srv/backup-storage/web-data
```

### Armazenamento de Banco de Dados

```bash
# Stop database service
sudo systemctl stop mysql

# Move data directory to external storage
sudo mv /var/lib/mysql /srv/backup-storage/mysql-data

# Create symlink
sudo ln -s /srv/backup-storage/mysql-data /var/lib/mysql

# Restart database
sudo systemctl start mysql
```

## Cronograma de Manutenção

### Tarefas Diárias

- Monitorar o status de montagem
- Verificar o espaço disponível
- Revisar os logs do sistema em busca de erros

### Tarefas Semanais

- Executar verificações do sistema de arquivos
- Verificar a integridade dos backups
- Atualizar a documentação de uso

### Tarefas Mensais

- Executar testes S.M.A.R.T.
- Revisar métricas de desempenho
- Planejar expansão de capacidade

## Integração com Outros Guias

Esta configuração de armazenamento externo complementa outras tarefas de gerenciamento de servidor:

- **Após a Instalação do SO**: Siga o [etcher-guide.md](etcher-guide.md) para a configuração inicial do sistema
- **Antes da Configuração de Armazenamento**: Complete o [disk-partitioning.md](disk-partitioning.md) para o layout principal do sistema
- **Reforço de Segurança**: Implemente controles de acesso e criptografia
- **Integração de Monitoramento**: Adicione métricas de armazenamento ao monitoramento do servidor

## Conclusão

A expansão de armazenamento externo é crucial para o crescimento de implantações de servidores comunitários. Planejamento, configuração e manutenção adequados garantem operação confiável e proteção de dados. Sempre priorize a segurança dos dados por meio de redundância, monitoramento e procedimentos regulares de manutenção.

A abordagem modular do armazenamento externo permite que servidores comunitários escalem de forma eficiente, mantendo consciência orçamentária e simplicidade operacional.