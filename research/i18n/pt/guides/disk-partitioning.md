---
title: Particionamento
sourcePath: guides/disk-partitioning.md
sourceHash: 09359b725b9a277e
translatedBy: glm-4.6
---

# Guia do Iniciante para Particionamento de Discos em Servidores Comunitários

Este guia abrangente cobre os fundamentos do particionamento de discos usando ferramentas gráficas e de linha de comando, com recomendações específicas para implantações de servidores comunitários.

## Entendendo o Particionamento de Discos

O particionamento de discos divide um dispositivo de armazenamento em seções separadas e independentes chamadas partições[16]. Cada partição pode ter seu próprio sistema de arquivos e serve a propósitos específicos em ambientes de servidor. Um particionamento adequado melhora o desempenho do sistema, simplifica backups e aumenta a segurança[17].

### Por Que Particionar os Discos do Seu Servidor?

1. **Separação de Responsabilidades**: Mantenha os arquivos do sistema separados dos dados dos usuários e logs[17]
2. **Otimização de Desempenho**: Reduza a fragmentação do disco e a contenção de E/S[17]
3. **Aprimoramento da Segurança**: Isole dados sensíveis e componentes do sistema
4. **Eficiência de Backup**: Permita backups direcionados de tipos específicos de dados
5. **Tolerância a Falhas**: Evite que uma partição cheia afete todo o sistema[17]

## Layout de Partições Recomendado para Servidores Comunitários

`[Partition Layout Example](partition-layout.png)`

### Esquema Padrão de Partições

Para a maioria das implantações de servidores comunitários, considere este layout:

| Partição | Ponto de Montagem | Tamanho | Sistema de Arquivos | Finalidade |
|-----------|-------------|------|-------------|---------|
| Boot | `/boot` | 1GB | ext4 | Arquivos do carregador de inicialização e kernels |
| Root | `/` | 20-50GB | ext4 | Arquivos do sistema e aplicativos |
| Var | `/var` | 10-20GB | ext4 | Dados variáveis, arquivos temporários |
| Var Log | `/var/log` | 5-10GB | ext4 | Logs do sistema e aplicativos[17] |
| Home | `/home` | 10-50GB | ext4 | Diretórios de usuários |
| Tmp | `/tmp` | 2-5GB | ext4 | Arquivos temporários[17] |
| Data | `/srv` ou `/data` | Espaço restante | ext4 | Dados de aplicativos e serviços |
| Swap | N/A | 1-2x RAM | swap | Memória virtual |

> **💡 Melhor Prática**
> 
> Separar `/var/log` de `/var` evita que os arquivos de log encham toda a partição `/var` e afetem a estabilidade do sistema[17].

## Método 1: Particionamento Gráfico com GParted

O GParted (GNOME Partition Editor) fornece uma interface intuitiva para gerenciar partições de disco[9].

### Instalando o GParted

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install gparted
```

**CentOS/RHEL/Fedora:**
```bash
sudo dnf install gparted  # Fedora
sudo yum install gparted  # CentOS/RHEL
```

### Usando o GParted

#### Etapa 1: Iniciar o GParted

1. Abra o GParted no menu de aplicativos ou execute:
   ```bash
   sudo gparted
   ```
2. Digite sua senha de administrador quando solicitado
3. O GParted examinará todos os dispositivos de armazenamento disponíveis

`[GParted In Use](gparted-screenshot.png)`

#### Etapa 2: Selecionar o Disco de Destino

1. Use o menu suspenso no canto superior direito para selecionar o disco de destino
2. **Verifique o tamanho e o modelo do disco** para garantir que está trabalhando com o dispositivo correto
3. Revise as partições existentes exibidas no layout gráfico

> **⚠️ Aviso Crítico**
> 
> Sempre verifique se você selecionou o disco correto. As operações de particionamento destruirão os dados existentes.

#### Etapa 3: Criar Tabela de Partições (se necessário)

Para discos novos:
1. Vá para **Device** → **Create Partition Table**
2. Selecione **GPT** para discos maiores que 2TB ou sistemas modernos
3. Selecione **MBR (msdos)** para compatibilidade com sistemas mais antigos[13]
4. Clique em **Apply**

#### Etapa 4: Criar Novas Partições

1. Clique com o botão direito no espaço não alocado
2. Selecione **New**
3. Configure as definições da partição:
   - **Size**: Especifique o tamanho da partição em MB ou GB
   - **Create as**: Escolha Primary, Extended ou Logical
   - **File system**: Selecione ext4 para partições Linux
   - **Label**: Adicione rótulos descritivos (por exemplo, "server-root", "data-storage")
4. Clique em **Add** para enfileirar a operação

#### Etapa 5: Aplicar as Alterações

1. Revise todas as operações enfileiradas na lista de operações pendentes
2. Clique em **Apply** para executar todas as alterações
3. Confirme a operação quando solicitado
4. Aguarde a conclusão (isso pode levar vários minutos para partições grandes)

### Operações Avançadas do GParted

#### Redimensionar Partições Existentes

1. Clique com o botão direito na partição a ser redimensionada
2. Selecione **Resize/Move**
3. Arraste os limites da partição ou insira tamanhos específicos
4. Aplique as alterações

#### Mover Partições

Use o diálogo **Resize/Move** para deslocar as localizações das partições no disco[11]. Isso é útil para consolidar espaço livre.

## Método 2: Particionamento por Linha de Comando

As ferramentas de linha de comando oferecem mais controle e recursos de automação para implantações de servidores.

### Usando o fdisk

O `fdisk` é uma ferramenta de particionamento por linha de comando poderosa, disponível em todos os sistemas Linux[14][16].

#### Etapa 1: Identificar o Disco de Destino

```bash
sudo fdisk -l
```

Este comando lista todos os discos e suas partições atuais[14]. Identifique seu disco de destino (por exemplo, `/dev/sdb`).

#### Etapa 2: Iniciar o fdisk

```bash
sudo fdisk /dev/sdb
```

Substitua `/dev/sdb` pelo seu disco de destino[14].

#### Etapa 3: Criar Partições

No prompt do fdisk:

1. **Criar nova partição**: Digite `n`
2. **Selecionar o tipo de partição**:
   - `p` para partição primária
   - `e` para partição estendida[14]
3. **Escolher o número da partição**: Aceite o padrão ou especifique (1-4 para primária)
4. **Definir o primeiro setor**: Aceite o padrão para alinhamento ideal
5. **Definir o último setor**: Especifique o tamanho usando o formato `+20G` para uma partição de 20GB[14]

#### Etapa 4: Definir o Tipo da Partição

1. Digite `t` para alterar o tipo da partição
2. Selecione o número da partição
3. Digite o código do tipo:
   - `83` para Linux (ext4)
   - `82` para Linux swap
   - `8e` para Linux LVM[26]

#### Etapa 5: Gravar as Alterações

1. Digite `p` para visualizar a tabela de partições
2. Digite `w` para gravar as alterações e sair[14]

### Usando o parted

O `parted` oferece recursos mais avançados e suporta tabelas de partições GPT[16].

#### Uso Básico do parted

```bash
# Start parted on target drive
sudo parted /dev/sdb

# Create GPT partition table
(parted) mklabel gpt

# Create partitions
(parted) mkpart primary ext4 0% 20GB
(parted) mkpart primary ext4 20GB 40GB
(parted) mkpart primary linux-swap 40GB 42GB

# Exit parted
(parted) quit
```

## Formatando Novas Partições

Depois de criar as partições, formate-as com os sistemas de arquivos apropriados[23].

### Formatar Partições ext4

```bash
# Format with ext4
sudo mkfs.ext4 /dev/sdb1

# Format with label
sudo mkfs.ext4 -L "server-root" /dev/sdb1
```

### Criar Partição Swap

```bash
# Format swap partition
sudo mkswap /dev/sdb3

# Enable swap
sudo swapon /dev/sdb3
```

### Verificar a Formatação

```bash
# Check file system information
sudo blkid /dev/sdb1

# List all block devices
lsblk -f
```

## Montando Partições

### Montagem Temporária

```bash
# Create mount point
sudo mkdir /mnt/server-data

# Mount partition
sudo mount /dev/sdb2 /mnt/server-data
```

### Montagem Permanente

Edite o `/etc/fstab` para montagem automática na inicialização:

```bash
sudo nano /etc/fstab
```

Adicione entradas usando UUID para maior confiabilidade:

```
UUID=12345678-1234-1234-1234-123456789012 /srv ext4 defaults 0 2
UUID=87654321-4321-4321-4321-210987654321 none swap sw 0 0
```

Obtenha os UUIDs com:
```bash
sudo blkid
```

## Recomendações Específicas por Plataforma

### Servidores Raspberry Pi

- **Partição Boot**: 256MB FAT32 para firmware
- **Partição Root**: mínimo de 8-16GB ext4
- **Use cartão SD para boot, SSD USB para dados** quando possível

### Servidores Comunitários x86

- **Partição do Sistema EFI**: 512MB FAT32 para sistemas UEFI
- **Partição Boot**: 1GB ext4
- **Considere LVM** para gerenciamento flexível de armazenamento[17]

### Servidores baseados em ARM

- Consulte a documentação do fabricante para requisitos específicos de particionamento
- Pode exigir partições de boot ou seções de firmware especiais

## Gerenciamento de Volumes Lógicos (LVM)

O LVM fornece recursos avançados de gerenciamento de armazenamento[17][24].

### Benefícios do LVM

1. **Redimensionamento Dinâmico**: Expandir ou reduzir volumes lógicos conforme necessário[24]
2. **Agrupamento de Armazenamento**: Combinar múltiplos discos físicos[17]
3. **Snapshots**: Criar backups de pontos no tempo
4. **Striping**: Melhorar o desempenho em múltiplos discos

### Configuração Básica do LVM

```bash
# Install LVM tools
sudo apt install lvm2

# Create physical volume
sudo pvcreate /dev/sdb1

# Create volume group
sudo vgcreate server-vg /dev/sdb1

# Create logical volumes
sudo lvcreate -L 20G -n root server-vg
sudo lvcreate -L 10G -n var server-vg
sudo lvcreate -l 100%FREE -n data server-vg

# Format logical volumes
sudo mkfs.ext4 /dev/server-vg/root
sudo mkfs.ext4 /dev/server-vg/var
sudo mkfs.ext4 /dev/server-vg/data
```

## Erros Comuns de Particionamento a Evitar

### Problemas Relacionados ao Tamanho

- **Partição root muito pequena**: Mínimo de 20GB, preferencialmente 30-50GB
- **Sem espaço swap**: Sempre inclua swap, mesmo com muita RAM
- **Partição boot oversized**: 1GB geralmente é suficiente

### Escolhas de Sistema de Arquivos

- **Usar FAT32 para sistemas Linux**: Use ext4 para melhor desempenho e recursos
- **Tipos de partição incorretos**: Certifique-se de usar os códigos de tipo de partição corretos no fdisk

### Falhas de Planejamento

- **Sem espaço para crescimento**: Deixe 10-20% de espaço não alocado para expansão futura
- **Separação inadequada**: Mantenha os logs separados dos arquivos do sistema[17]

## Solução de Problemas Comuns

### Problemas de Reconhecimento de Partições

```bash
# Force kernel to re-read partition table
sudo partprobe /dev/sdb

# Or reboot if partprobe fails
sudo reboot
```

### Problemas de Alinhamento

- Sempre aceite os setores iniciais padrão para alinhamento ideal de SSDs
- Use o `parted` com o comando `align-check` para verificar o alinhamento

### Falhas de Montagem

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Check /etc/fstab syntax
sudo mount -a
```
## Backup e Recuperação

### Antes do Particionamento

1. **Faça backup dos dados importantes** em armazenamento externo
2. **Documente o layout atual das partições**:
   ```bash
   sudo fdisk -l > partition-backup.txt
   sudo blkid > uuid-backup.txt
   ```

### Backup da Tabela de Partições

```bash
# Backup partition table
sudo dd if=/dev/sdb of=partition-table.backup bs=512 count=1

# Restore partition table (emergency use only)
sudo dd if=partition-table.backup of=/dev/sdb bs=512 count=1
```

## Integração com Outras Tarefas de Configuração do Servidor

Após o particionamento:

- **Próximo**: Configure os pontos de montagem e o `/etc/fstab`
- **Expansão de Armazenamento**: Consulte [external-storage.md](external-storage.md) para adicionar mais discos
- **Configuração Inicial**: Conclua a instalação do sistema operacional usando seu novo layout de partições
- **Monitoramento**: Configure o monitoramento de uso de disco para cada partição

## Considerações de Segurança

1. **Criptografe partições sensíveis** usando LUKS
2. **Defina opções de montagem apropriadas** (`noexec`, `nosuid` para `/tmp`)
3. **Monitoramento regular** do uso das partições
4. **Controles de acesso** nos pontos de montagem

## Conclusão

O particionamento adequado do disco é fundamental para servidores comunitários estáveis e de fácil manutenção. Use ferramentas gráficas como o GParted para simplicidade ou ferramentas de linha de comando para automação e recursos avançados. Sempre planeje o layout das partições com base no seu caso de uso específico, mantenha backups e monitore o uso do disco regularmente.

O investimento em um particionamento adequado traz retornos em estabilidade do sistema, desempenho e eficiência de manutenção ao longo do ciclo de vida do seu servidor.