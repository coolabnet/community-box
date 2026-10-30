---
title: Configuração da BIOS
sourcePath: hardware/intel_nuc/nuc-bios-setup.md
sourceHash: 48f435ea0fc646fe
translatedBy: glm-4.6
---

# Guia de Configuração de BIOS/UEFI do Intel NUC para Implantação de Servidor Comunitário

## Introdução

A configuração adequada da BIOS/UEFI é crucial para a operação estável de servidores Intel NUC. Este guia fornece instruções passo a passo adaptadas para plataformas de servidor comunitário como YunoHost, Caprover e CasaOS, com foco em confiabilidade, segurança e desempenho ideal.

## Preparação Antes da Configuração

### Equipamento Necessário
- **Teclado USB com fio** (teclados Bluetooth podem não funcionar na BIOS)
- **Monitor HDMI/DisplayPort** (telas USB-C podem não exibir a BIOS)
- **Fonte de alimentação** adequada para o seu modelo de NUC
- **Pen drive USB** (para atualizações de BIOS, se necessário)

### Observações Importantes
- Sempre conecte o teclado às portas USB traseiras para acesso à BIOS
- Desative o Fast Boot no Windows antes de acessar a BIOS se estiver usando dual-boot
- Tenha a senha de supervisor da BIOS/UEFI em mãos, se ela tiver sido definida anteriormente

## Acessando a BIOS/UEFI

### Método Padrão
1. **Ligue** o NUC enquanto mantém pressionada a tecla **F2**
2. Continue segurando F2 até que a configuração da BIOS apareça
3. Se estiver usando um ASUS NUC, você poderá ver brevemente o logotipo da ASUS

### Métodos Alternativos (se F2 falhar)

#### Método 1: Menu do Botão de Energia
1. **Desligue** completamente o NUC
2. **Pressione e segure** o botão de energia por 3 segundos, depois solte
3. **Pressione F7** quando o Menu do Botão de Energia aparecer
4. Selecione "BIOS Setup" no menu

#### Método 2: Método de Inicialização a Frio
1. **Desconecte** completamente a fonte de alimentação
2. Espere 10 segundos
3. **Reconecte** a energia e imediatamente pressione F2 repetidamente
4. Este método frequentemente funciona quando o Fast Boot está ativado

#### Método 3: Configurações UEFI (Windows)
Se o Windows estiver instalado:
1. Mantenha **Shift** pressionado enquanto clica em "Reiniciar"
2. Vá para **Solução de Problemas** → **Opções Avançadas** → **Configurações de Firmware UEFI**
3. Clique em **Reiniciar** para iniciar na BIOS

## Configuração Inicial da BIOS

### Etapa 1: Restaurar os Padrões
```
1. Pressione F9 (Load BIOS Defaults)
2. Confirme com Enter
3. Isso garante uma configuração inicial limpa
```

### Etapa 2: Informações Básicas do Sistema
Verifique se as seguintes informações estão corretas:
- **Versão da BIOS**: Anote a versão atual
- **Modelo da CPU**: Confirme a identificação do processador
- **Memória**: Verifique se toda a RAM instalada foi detectada
- **Armazenamento**: Verifique se todos os discos foram reconhecidos

## Configurações Essenciais para Servidores

### Configuração de Segurança

#### Definir Senha de Supervisor
```
Navegação: Advanced → Security → Passwords → Set Supervisor Password
Recomendado: senha de 12+ caracteres com mistura de letras e números
Armazenamento: documente a senha com segurança - necessária para alterações futuras
```

#### Configurar Secure Boot (Recomendado: Desativado para Linux)
```
Navegação: Advanced → Security → Secure Boot
Configuração: Disabled
Motivo: muitas distribuições Linux exigem o Secure Boot desativado
Alternativa: algumas distribuições mais recentes suportam Secure Boot
```

#### Configuração de Inicialização
```
Navegação: Advanced → Boot → Boot Configuration
Configurações:
- Network Boot: Disabled (a menos que inicialização PXE seja necessária)
- USB Boot: Enabled (para mídia de instalação)
- Boot Device Control: Lock UEFI Boot (impede alterações não autorizadas)
```

### Configurações de Gerenciamento de Energia

#### Configurar Comportamento de Energia
```
Navegação: Advanced → Power → Secondary Power Settings

After Power Failure: Power On
- Garante que o servidor reinicie automaticamente após quedas de energia
- Crítico para operação de servidor headless

Wake on LAN: Enabled
- Permite acordar remotamente via pacotes mágicos de rede
- Útil para operação com eficiência energética

USB Wake Support: Disabled
- Previne acordar acidentalmente por atividade de dispositivos USB
- Recomendado para estabilidade do servidor
```

#### Configurações de Energia da CPU
```
Navegação: Advanced → Power → CPU Power Management

Enhanced Intel SpeedStep: Enabled
- Permite escala dinâmica de frequência da CPU
- Melhora a eficiência energética sob cargas variáveis

Turbo Mode: Enabled
- Permite que a CPU exceda a frequência base quando necessário
- Importante para desempenho do servidor em picos de carga
```

### Resfriamento e Gerenciamento Térmico

#### Configuração de Controle do Ventilador
```
Navegação: Advanced → Cooling → CPU Fan Header

Fan Control Mode: Quiet
- Minimiza o ruído para ambientes domésticos/escritório
- Alternativa: Balanced para necessidades de maior desempenho

Curvas personalizadas de fan: disponíveis em alguns modelos
- Defina com base em limites de temperatura
- Equilibre entre refrigeração e ruído
```

### Configuração de Armazenamento

#### Configurações M.2 e SATA
```
Navegação: Advanced → Devices → Storage

SATA Mode: AHCI
- Necessário para compatibilidade com Linux
- NÃO use o modo RAID/RST a menos que seja especificamente necessário

M.2 Slot Configuration: Auto
- Permite detecção automática de unidades NVMe/SATA
- Verifique se todas as unidades instaladas aparecem na lista
```

#### Configuração de Prioridade de Inicialização
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

### Distribuições Linux para Servidores (Ubuntu, Debian, CentOS)

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
Network Stack: Enabled (para PXE se necessário)
```

### Considerações para Windows Server

#### Requisitos Especiais
```
Secure Boot: Pode permanecer ativado para Windows Server 2019+
TPM: Enabled se disponível
Intel AMT: Enabled para gerenciamento remoto (modelos corporativos)
```

#### Preparação de Drivers de Rede
Observação: O Windows Server exige instalação manual de drivers de rede
- Baixe os drivers Intel LAN antecipadamente
- Use o método "Have Disk" durante a instalação dos drivers
- Consulte a documentação específica do seu modelo para etapas detalhadas de instalação de drivers

## Opções de Configuração Avançadas

### Configurações Intel vPro e AMT (Modelos Corporativos)

#### Ativar Gerenciamento Remoto
```
Navegação: Advanced → Intel AMT Configuration

Intel AMT: Enabled
Network Access: Network Active
SOL Terminal: Enabled (para Serial Over LAN)

Processo de configuração:
1. Ative o AMT na BIOS
2. Configure as definições de rede
3. Defina a senha do AMT durante a primeira inicialização
4. Acesse via https://[nuc-ip]:16992
```

### Configurações de Virtualização

#### Para ESXi, Proxmox, Hyper-V
```
Intel Virtualization Technology (VT-x): Enabled
Intel VT for Directed I/O (VT-d): Enabled
Execute Disable Bit: Enabled

Adicionais para ESXi:
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
- Não disponível em modelos NUC de consumidor
```

## Otimizações Específicas da Plataforma

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

Sem requisitos especiais - funciona com configuração padrão de Ubuntu/Debian
```

### Configuração do Caprover
```
Configurações recomendadas:
- Suporte a Docker: Intel VT-x Enabled
- Otimização de rede: Wake on LAN Enabled
- Configuração padrão de servidor Linux

Suporte a virtualização recomendado para eficiência de contêineres
```

## Processo de Atualização da BIOS

### Verificando a Versão da BIOS
```
Versão atual: anote na tela principal da BIOS
Versão mais recente: verifique o site de suporte da ASUS para o seu modelo
Atualização necessária: se a versão tiver mais de 6 meses
```

### Métodos de Atualização

#### Método 1: Express BIOS Update (Recomendado)
```
Requisitos: ambiente Windows
Processo:
1. Baixe o instalador Express BIOS da ASUS
2. Execute o instalador como Administrator
3. Siga as instruções para atualização automática
4. O sistema reiniciará automaticamente
```

#### Método 2: Atualização de BIOS via F7
```
Requisitos: pen drive USB, arquivo capsule da BIOS
Processo:
1. Baixe o arquivo .cap para o diretório raiz do USB
2. Desligue o NUC
3. Segure o botão de energia por 3 segundos e solte
4. Pressione F7 quando o Power Button Menu aparecer
5. A BIOS detectará e instalará a atualização automaticamente
```

#### Método 3: Atualização via UEFI Shell
```
Somente usuários avançados - use o utilitário iFlash
Consulte a documentação da ASUS para etapas específicas
```

## Verificação Após a Configuração

### Testes de Estabilidade do Sistema
```
1. Inicialize no sistema operacional alvo com sucesso
2. Verifique se todo o hardware foi detectado corretamente
3. Verifique o comportamento do gerenciamento de energia
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

2. **Configurações Incorretas do Ventilador**
   - O modo "Performance" é muito alto para uso doméstico
   - O modo "Silent" pode causar limitação térmica

3. **Configurações de Virtualização Incorretas**
   - VT-x desativado impede o uso de Docker/VMs
   - VT-d desativado limita recursos avançados

4. **Configuração de Segurança Insuficiente**
   - Sem senha de supervisor
   - Secure Boot ativado para sistemas operacionais não suportados

5. **Problemas de Configuração de Rede**
   - Wake on LAN desativado
   - Inicialização pela rede deixada ativada desnecessariamente

### ✅ Boas Práticas

1. **Documente as Configurações**
   - Tire fotos das telas críticas da BIOS
   - Anote quaisquer configurações personalizadas

2. **Atualizações Regulares**
   - Verifique atualizações de BIOS trimestralmente
   - Atualize durante janelas de manutenção planejadas

3. **Backup da Configuração**
   - Alguns modelos suportam exportação de perfil da BIOS
   - Documente as configurações personalizadas para restauração

## Solução de Problemas da BIOS

### Não Consigo Acessar a BIOS
```
Soluções:
1. Use teclado com fio na porta traseira
2. Tente o método de boot frio (desligue a energia)
3. Desative o Fast Boot pelo Windows
4. Use o método do Power Button Menu
```

### Configurações da BIOS Não São Salvas
```
Causas:
- Falha da bateria CMOS (raro em NUCs)
- Interrupção de energia durante o salvamento
- Configurações do BIOS corrompidas

Soluções:
1. Carregue os padrões e reconfigure
2. Atualize o firmware do BIOS
3. Contate o suporte da ASUS se persistir
```

### Problemas de Inicialização Após a Configuração
```
Opções de Recuperação:
1. Carregue os padrões do BIOS (F9)
2. Use o jumper de recuperação do BIOS (se disponível)
3. Recuperação via Power Button Menu
4. Modo de recuperação do BIOS
```

## Reforço de Segurança

### Configurações para Ambiente de Produção
```
Supervisor Password: Obrigatória
User Password: Opcional
Boot Device Control: Lock UEFI Boot Order
USB Boot: Desativado (após a instalação do SO)
Network Boot: Desativado
Secure Boot: Ativado (se o SO suportar)
Intel AMT: Desativado (a menos que seja necessário)
```

### Configurações para Ambiente Doméstico
```
Supervisor Password: Recomendada
Wake on LAN: Ativado
Auto Power On: Ativado
USB Boot: Ativado (para manutenção)
Secure Boot: Desativado (para flexibilidade)
```

## Etapas Finais e Documentação

### Salvar a Configuração
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
- Consulte considerações específicas do modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

**Importante**: Sempre verifique se essas configurações funcionam com seu modelo específico e o sistema operacional pretendido antes de implantar em produção.