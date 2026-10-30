---
title: Configuração do BIOS
sourcePath: hardware/intel_nuc/nuc-bios-setup.md
sourceHash: 48f435ea0fc646fe
translatedBy: glm-4.6
---

# Guia de Configuração de BIOS/UEFI do Intel NUC para Implantação de Servidor Comunitário

## Introdução

Uma configuração adequada de BIOS/UEFI é crucial para a operação estável de servidores Intel NUC. Este guia fornece instruções passo a passo adaptadas para plataformas de servidor comunitário como YunoHost, Caprover e CasaOS, com foco em confiabilidade, segurança e desempenho ideal.

## Preparação Antes da Configuração

### Equipamento Necessário
- **Teclado USB com fio** (teclados Bluetooth podem não funcionar na BIOS)
- **Monitor HDMI/DisplayPort** (monitores USB-C podem não exibir a BIOS)
- **Adaptador de energia** apropriado para o seu modelo de NUC
- **Pen drive USB** (para atualizações de BIOS, se necessário)

### Notas Importantes
- Sempre conecte o teclado às portas USB traseiras para acessar a BIOS
- Desative o Fast Boot no Windows antes de acessar a BIOS se estiver usando dual boot
- Tenha em mãos a senha de supervisor da BIOS/UEFI, se definida anteriormente

## Acessando a BIOS/UEFI

### Método Padrão
1. **Ligue** o NUC enquanto segura a tecla **F2**
2. Continue segurando F2 até que a configuração da BIOS apareça
3. Se estiver usando um ASUS NUC, você pode ver o logotipo da ASUS brevemente

### Métodos Alternativos (se F2 falhar)

#### Método 1: Menu do Botão de Energia
1. **Desligue** completamente o NUC
2. **Pressione e segure** o botão de energia por 3 segundos, depois solte
3. **Pressione F7** quando o Power Button Menu aparecer
4. Selecione "BIOS Setup" (Configuração da BIOS) no menu

#### Método 2: Método de Boot a Frio
1. **Desconecte** completamente o adaptador de energia
2. Aguarde 10 segundos
3. **Reconecte** a energia e imediatamente pressione F2 repetidamente
4. Este método geralmente funciona quando o Fast Boot está ativado

#### Método 3: Configurações UEFI (Windows)
Se o Windows estiver instalado:
1. Segure **Shift** ao clicar em "Restart" (Reiniciar)
2. Vá para **Troubleshoot** → **Advanced Options** → **UEFI Firmware Settings**
3. Clique em **Restart** para inicializar na BIOS

## Configuração Inicial da BIOS

### Passo 1: Restaurar Padrões
```
1. Pressione F9 (Load BIOS Defaults / Carregar padrões do BIOS)
2. Confirme com Enter
3. Isso garante uma configuração inicial limpa
```

### Passo 2: Informações Básicas do Sistema
Verifique se as seguintes informações estão corretas:
- **Versão da BIOS**: Anote a versão atual
- **Modelo da CPU**: Confirme a identificação do processador
- **Memória**: Verifique se toda a RAM instalada foi detectada
- **Armazenamento**: Confira se todos os discos foram reconhecidos

## Configurações Essenciais para Servidor

### Configuração de Segurança

#### Definir Senha de Supervisor
```
Navegação: Advanced → Security → Passwords → Set Supervisor Password
Recomendado: senha de 12+ caracteres com mistura de letras e números
Armazenamento: documente a senha com segurança — será necessária para alterações futuras
```

#### Configurar Secure Boot (Recomendado: Disabled para Linux)
```
Navigation: Advanced → Security → Secure Boot
Setting: Disabled
Reason: Many Linux distributions require Secure Boot disabled
Alternative: Some newer distributions support Secure Boot
```

#### Configuração de Boot
```
Navegação: Advanced → Boot → Boot Configuration
Configurações:
- Network Boot: Disabled (a menos que seja necessário inicializar via PXE)
- USB Boot: Enabled (para mídia de instalação)
- Boot Device Control: Lock UEFI Boot (impede alterações não autorizadas)
```

### Configurações de Gerenciamento de Energia

#### Configurar Comportamento de Energia
```
Navegação: Advanced → Power → Secondary Power Settings

After Power Failure: Power On
- Garante que o servidor reinicie automaticamente após quedas de energia
- Crítico para operação de servidor sem monitor (headless)

Wake on LAN: Enabled
- Permite despertar remotamente via pacotes mágicos de rede
- Útil para operação com eficiência energética

USB Wake Support: Disabled
- Evita despertar acidentalmente por atividade de dispositivos USB
- Recomendado para estabilidade do servidor
```

#### Configurações de Energia da CPU
```
Navegação: Advanced → Power → CPU Power Management

Enhanced Intel SpeedStep: Enabled
- Permite escalonamento dinâmico de frequência da CPU
- Melhora a eficiência energética sob cargas variáveis

Turbo Mode: Enabled
- Permite que a CPU exceda a frequência base quando necessário
- Importante para o desempenho do servidor em picos de carga
```

### Gerenciamento de Resfriamento e Temperatura

#### Configuração do Controle de Ventoinha
```
Navigation: Advanced → Cooling → CPU Fan Header

Fan Control Mode: Quiet
- Minimizes noise for home/office environments
- Alternative: Balanced for higher performance needs

Custom Fan Curves: Available on some models
- Set based on temperature thresholds
- Balance between cooling and noise
```

### Configuração de Armazenamento

#### Configurações M.2 e SATA
```
Navegação: Advanced → Devices → Storage

SATA Mode: AHCI
- Necessário para compatibilidade com Linux
- NÃO use modo RAID/RST a menos que seja especificamente necessário

M.2 Slot Configuration: Auto
- Permite detecção automática de drives NVMe/SATA
- Verifique se todos os drives instalados aparecem na lista
```

#### Configuração de Prioridade de Boot
```
Navegação: Advanced → Boot → Boot Priority

UEFI Boot Priority:
1. USB (para instalação)
2. Dispositivo de armazenamento primário
3. Inicialização pela rede (se necessário)

Legacy Boot: Disabled
- Sistemas operacionais modernos preferem UEFI
- Reduz possíveis problemas de compatibilidade
```

## Configurações Específicas do Sistema Operacional

### Distribuições Linux para Servidor (Ubuntu, Debian, CentOS)

#### Configurações Essenciais
```
UEFI Boot: Enabled
Secure Boot: Disabled
CSM (Compatibility Support Module): Disabled
Intel VT-x: Enabled (para virtualização)
Intel VT-d: Enabled (para virtualização avançada)
```

#### Configuração de Rede
```
Navegação: Advanced → Devices → Network

Wake on LAN: Enabled
Network Stack: Enabled (para PXE, se necessário)
```

### Considerações para Windows Server

#### Requisitos Especiais
```
Secure Boot: pode permanecer Enabled para Windows Server 2019+
TPM: Enabled se disponível
Intel AMT: Enabled para gerenciamento remoto (modelos corporativos)
```

#### Preparação de Drivers de Rede
Nota: O Windows Server requer instalação manual do driver de rede
- Baixe os drivers Intel LAN antecipadamente
- Use o método "Have Disk" durante a instalação do driver
- Consulte a documentação específica do seu modelo para etapas detalhadas de instalação do driver

## Opções de Configuração Avançadas

### Configurações Intel vPro e AMT (Modelos Corporativos)

#### Ativar Gerenciamento Remoto
```
Navegação: Advanced → Intel AMT Configuration

Intel AMT: Enabled
Network Access: Network Active
SOL Terminal: Enabled (para Serial Over LAN)

Processo de configuração:
1. Ative o AMT no BIOS
2. Configure as definições de rede
3. Defina a senha do AMT na primeira inicialização
4. Acesse via https://[nuc-ip]:16992
```

### Configurações de Virtualização

#### Para ESXi, Proxmox, Hyper-V
```
Intel Virtualization Technology (VT-x): Enabled
Intel VT for Directed I/O (VT-d): Enabled
Execute Disable Bit: Enabled

Adicional para ESXi:
- SR-IOV: Enabled (se disponível)
- IOMMU: Enabled
```

### Configuração de Memória

#### Configurações de Memória
```
Navegação: Advanced → Memory

Memory Profile: Auto ou XMP Profile 1
- Ativa as velocidades nominais da memória
- Importante para desempenho

ECC Support: Auto
- Ativado automaticamente se memória ECC for detectada
- Não disponível em modelos NUC de consumo
```

## Otimizações Específicas por Plataforma

### Configuração do YunoHost
```
Configurações recomendadas:
- Secure Boot: Disabled
- Legacy Boot: Disabled
- Network Boot: Disabled
- Wake on LAN: Enabled
- Auto Power On: Enabled

Problemas conhecidos:
- Alguns modelos NUC exigem a inicialização UEFI desativada
- Teste a instalação com UEFI primeiro, com fallback para Legacy se necessário
```

### Configuração do CasaOS
```
Configurações recomendadas:
- Configurações padrão de servidor Linux
- Otimização para Docker: Intel VT-x Enabled
- Wake on LAN: Enabled para gerenciamento remoto

Sem requisitos especiais — funciona com configuração padrão de Ubuntu/Debian
```

### Configuração do Caprover
```
Configurações recomendadas:
- Suporte a Docker: Intel VT-x Enabled
- Otimização de rede: Wake on LAN Enabled
- Configuração padrão de servidor Linux

Suporte à virtualização recomendado para eficiência de contêineres
```

## Processo de Atualização da BIOS

### Verificando a Versão da BIOS
```
Versão atual: anote na tela principal do BIOS
Versão mais recente: consulte o site de suporte da ASUS para o seu modelo
Atualização necessária: se a versão tiver mais de 6 meses
```

### Métodos de Atualização

#### Método 1: Express BIOS Update (Recomendado)
```
Requisitos: ambiente Windows
Processo:
1. Baixe o instalador Express BIOS da ASUS
2. Execute o instalador como Administrador
3. Siga as instruções para atualização automática
4. O sistema reiniciará automaticamente
```

#### Método 2: Atualização de BIOS via F7
```
Requisitos: pen drive USB, arquivo de cápsula do BIOS
Processo:
1. Baixe o arquivo .cap para o diretório raiz do USB
2. Desligue o NUC
3. Mantenha o botão de energia pressionado por 3 segundos, solte
4. Pressione F7 quando o Power Button Menu aparecer
5. O BIOS detectará e instalará a atualização automaticamente
```

#### Método 3: Atualização via UEFI Shell
```
Somente para usuários avançados — use o utilitário iFlash
Consulte a documentação da ASUS para passos específicos
```

## Verificação Pós-Configuração

### Testes de Estabilidade do Sistema
```
1. Inicialize no sistema operacional alvo com sucesso
2. Verifique se todo o hardware foi detectado corretamente
3. Confira o comportamento do gerenciamento de energia
4. Teste a conectividade de rede
5. Valide o desempenho do armazenamento
```

### Ferramentas de Monitoramento
```
Monitoramento integrado:
- Hardware Monitor: verifique temperaturas e voltagens
- Boot Options: verifique a sequência de inicialização
- Security Status: confirme as configurações de segurança

Ferramentas externas:
- Linux: lm-sensors, htop, iotop
- Windows: HWiNFO, CPU-Z, CrystalDiskInfo
```

## Erros Comuns de Configuração

### ❌ Erros a Evitar

1. **Deixar o Fast Boot Ativado**
   - Impede o acesso à BIOS
   - Pode causar problemas de inicialização com Linux

2. **Configurações Erradas da Ventoinha**
   - Modo "Performance" é barulhento demais para uso doméstico
   - Modo "Silent" pode causar throttling térmico

3. **Configurações de Virtualização Incorretas**
   - VT-x desativado impede Docker/VMs
   - VT-d desativado limita recursos avançados

4. **Configuração de Segurança Insuficiente**
   - Sem senha de supervisor
   - Secure Boot ativado para SO não suportado

5. **Problemas de Configuração de Rede**
   - Wake on LAN desativado
   - Network boot deixado ativado desnecessariamente

### ✅ Boas Práticas

1. **Documentar as Configurações**
   - Tire fotos das telas críticas da BIOS
   - Anote quaisquer configurações personalizadas

2. **Atualizações Regulares**
   - Verifique atualizações da BIOS trimestralmente
   - Atualize durante janelas de manutenção planejadas

3. **Backup da Configuração**
   - Alguns modelos suportam exportação de perfil da BIOS
   - Documente as configurações personalizadas para restauração

## Solução de Problemas da BIOS

### Não Consigo Acessar a BIOS
```
Soluções:
1. Use teclado com fio na porta traseira
2. Tente o método de cold boot (desconecte a energia)
3. Desative o Fast Boot pelo Windows
4. Use o método Power Button Menu
```

### Configurações da BIOS Não São Salvas
```
Causas:
- Falha da bateria CMOS (raro em NUCs)
- Interrupção de energia durante o salvamento
- Configurações de BIOS corrompidas

Soluções:
1. Load defaults (carregar padrões) e reconfigure
2. Atualize o firmware da BIOS
3. Contate o suporte da ASUS se persistir
```

### Problemas de Boot Após a Configuração
```
Opções de recuperação:
1. Load BIOS defaults (F9) (carregar padrões da BIOS)
2. Use o jumper de recuperação da BIOS (se disponível)
3. Recuperação via Power Button Menu
4. Modo de recuperação da BIOS
```

## Reforço de Segurança

### Configurações para Ambiente de Produção
```
Supervisor Password: Required (obrigatória)
User Password: Optional (opcional)
Boot Device Control: Lock UEFI Boot Order
USB Boot: Disabled (desativado, após a instalação do SO)
Network Boot: Disabled (desativado)
Secure Boot: Enabled (ativado, se o SO suportar)
Intel AMT: Disabled (desativado, a menos que seja necessário)
```

### Configurações para Ambiente Doméstico
```
Supervisor Password: Recommended (recomendada)
Wake on LAN: Enabled (ativado)
Auto Power On: Enabled (ativado)
USB Boot: Enabled (ativado, para manutenção)
Secure Boot: Disabled (desativado, para flexibilidade)
```

## Passos Finais e Documentação

### Salvar Configuração
```
1. Pressione F10 para salvar e sair
2. Confirme as alterações quando solicitado
3. O sistema reiniciará com as novas configurações
```

### Documente Sua Configuração
Crie um registro de configuração incluindo:
- Versão da BIOS
- Principais configurações modificadas
- Senhas utilizadas (armazenadas com segurança)
- Data da configuração
- Propósito/justificativa das configurações

---

**Próximos Passos:**
- Configure as opções de energia e rede: [nuc-power-network.md](nuc-power-network.md)
- Revise considerações específicas do modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

**Importante**: Sempre verifique se essas configurações funcionam com o seu modelo específico e o sistema operacional pretendido antes de implantar em produção.