---
title: YunoHost
sourcePath: software/yunohost/README.md
sourceHash: 1bff59f1946a2dc7
translatedBy: glm-4.6
---

# Visão Geral do YunoHost para Servidores Comunitários

## Introdução

O YunoHost é um sistema operacional completo para servidores que simplifica a implantação e o gerenciamento de aplicações web. Ele fornece uma interface amigável para instalar, configurar e manter diversos serviços com o mínimo de conhecimento técnico necessário[11][14].

## Principais Recursos

### Gerenciamento de Aplicações
- **Instalações com Um Clique**: Mais de 200 aplicações pré-empacotadas disponíveis
- **Atualizações Automáticas**: Tanto para o sistema quanto para as aplicações instaladas
- **Catálogo de Aplicações**: Navegue e instale aplicações web diretamente da interface de administração
- **Suporte a Múltiplas Aplicações**: Hospede vários serviços em um único servidor

### Gerenciamento de Usuários
- **Gerenciamento de Domínios**: Suporte a múltiplos domínios e subdomínios
- **Portal do Usuário**: Portal SSO (Single Sign-On) personalizável para os usuários
- **Integração de E-mail**: Servidor de e-mail completo com antispam e antivírus
- **LDAP/Active Directory**: Integração com serviços de diretório existentes

### Recursos de Segurança
- **Certificados SSL/TLS**: Gerenciamento automático de certificados Let's Encrypt
- **Fail2Ban**: Proteção contra ataques de força bruta
- **Firewall**: Configuração de firewall integrada
- **Backups Automáticos**: Soluções de backup programadas e sob demanda
- **Auto-Atualização**: Patches de segurança aplicados automaticamente

## Compatibilidade com o Hardware da Community Box

### Suporte ao Raspberry Pi
- **Raspberry Pi 4**: Oficialmente suportado com imagens dedicadas
- **Raspberry Pi 5**: Suporte nativo com o YunoHost 12+ mais recente
- **RAM Mínima**: 1GB (2GB recomendado para produção)
- **Armazenamento**: Cartões microSD Classe A1/A2 recomendados (mínimo de 32GB)

### Compatibilidade com Intel NUC
- **Suporte Total a x86_64**: Excelente desempenho em hardware Intel
- **Suporte a Múltiplos Usuários**: Suporta confortavelmente 20+ usuários simultâneos
- **Especificações Recomendadas**: 4GB+ de RAM, 64GB+ de armazenamento
- **Configuração Ótima**: Armazenamento SSD para melhor desempenho

### Suporte ao ZimaBoard
- **Arquitetura ARM64**: Compatibilidade nativa
- **Configuração de Armazenamento**: Suporte a múltiplas unidades para armazenamento redundante
- **Configuração Recomendada**: Armazenamento SATA ou NVMe com configuração RAID
- **Casos de Uso**: Servidores para pequenas empresas, portais comunitários

## Requisitos de Instalação

### Requisitos do Sistema
- **RAM**: Mínimo de 1GB (2GB+ recomendado)
- **Armazenamento**: Mínimo de 16GB (64GB recomendado)
- **Rede**: Conexão Ethernet fortemente recomendada
- **Sistema Operacional**: ISO do YunoHost ou sistema base baseado em Debian

### Métodos de Instalação
1. **Instalação Direta**: Gravar a imagem oficial do YunoHost
2. **Base Debian**: Instalar sobre uma instalação Debian existente
3. **Docker**: Disponível para testes e desenvolvimento
4. **Vagrant**: Para ambientes de desenvolvimento

## Aplicações Populares

### Comunicação
- **Matrix Synapse**: Protocolo de mensagens descentralizado
- **Jitsi Meet**: Solução de videoconferência
- **Servidor de E-mail**: Servidor de e-mail completo com webmail
- **IRC**: Servidor de Internet Relay Chat

### Colaboração
- **Nextcloud**: Plataforma de compartilhamento de arquivos e colaboração
- **Kanboard**: Ferramenta de gerenciamento de projetos
- **Calibre Web**: Gerenciamento de biblioteca digital
- **Monica**: Gerenciamento de relacionamentos pessoais

### Serviços Comunitários
- **WordPress**: Sistema de gerenciamento de conteúdo
- **Pi-hole**: Bloqueio de anúncios em toda a rede
- **Vaultwarden**: Gerenciador de senhas
- **MediaWiki**: Plataforma wiki comunitária

## Implantação de Plataformas Comunitárias

### Configuração Básica Comunitária
1. **Instalar o YunoHost**: Gravar e configurar o sistema base
2. **Configurar o Domínio**: Definir o domínio principal e SSL
3. **Criar Usuários**: Adicionar membros da comunidade como usuários
4. **Instalar Aplicações**: Implantar serviços essenciais
5. **Configurar Backups**: Definir um agendamento de backup automático

### Configuração Avançada
- **Múltiplos Domínios**: Criar subdomínios para diferentes serviços
- **Aplicações Personalizadas**: Implantar aplicações web personalizadas
- **Gerenciamento de API**: Configurar APIs REST e integrações
- **Integração LDAP**: Conectar com diretórios de usuários existentes

## Otimização de Desempenho

### Para Raspberry Pi
- **Usar Armazenamento SSD**: Evite microSD para dados de produção
- **Otimizar Aplicações**: Limite aplicações pesadas simultâneas
- **Gerenciamento de Memória**: Configure swap se necessário
- **Controle de Temperatura**: Garanta refrigeração adequada

### Para Hardware Intel
- **Escalonamento Multiusuário**: Pode suportar dezenas de usuários
- **Aplicações Pesadas**: Execute serviços intensivos em banco de dados
- **Configuração RAID**: Implemente armazenamento redundante
- **Balanceamento de Carga**: Configure múltiplos servidores se necessário

## Backup e Recuperação

### Estratégias de Backup
- **Backups Diários Automáticos**: Períodos de retenção configuráveis
- **Específicos por Aplicação**: Algumas aplicações suportam backups granulares
- **Backups Criptografados**: Criptografia opcional para dados sensíveis
- **Armazenamento Externo**: Sincronize com locais remotos ou armazenamento em nuvem

### Processo de Recuperação
1. **Recuperação do Sistema**: Reinstalar o sistema base do YunoHost
2. **Restaurar do Backup**: Usar arquivos de backup para restaurar
3. **Configuração de Aplicações**: Reinstalar e reconfigurar as aplicações
4. **Verificação de Dados**: Confirmar que todos os dados foram restaurados

## Manutenção e Atualizações

### Manutenção Regular
- **Atualizar o Sistema**: Atualizações mensais de segurança e recursos
- **Monitorar Logs**: Verificar logs de aplicações e do sistema
- **Verificação de Backups**: Testar a restauração de backups regularmente
- **Auditorias de Segurança**: Revisar acessos e permissões de usuários

### Solução de Problemas Comuns
- **Falhas de Aplicações**: Verificar logs e reiniciar serviços
- **Problemas de Desempenho**: Monitorar o uso de recursos
- **Problemas de SSL**: Renovar certificados ou verificar a configuração de DNS
- **Acesso de Usuários**: Verificar permissões e configuração de domínio

## Suporte da Comunidade

### Recursos Oficiais
- **Documentação**: https://yunohost.org/en/doc
- **Fórum**: Fórum de suporte comunitário ativo
- **Chat**: Canais de chat IRC e Mattermost
- **Solicitações de Pacotes**: Enviar solicitações para novas aplicações

### Contribuições da Comunidade
- **Empacotamento de Aplicações**: Ajude a empacotar aplicações para o YunoHost
- **Traduções**: Contribua com traduções para o seu idioma
- **Relatórios de Bugs**: Reporte problemas no GitHub
- **Documentação**: Melhore a documentação oficial

## Melhores Práticas de Segurança

### Endurecendo Seu Servidor
1. **Alterar Senhas Padrão**: Atualize todas as credenciais padrão
2. **Desativar Login Root**: Restrinja o acesso SSH por segurança
3. **Configurar Firewall**: Limite as portas expostas ao essencial
4. **Atualizações Regulares**: Mantenha o sistema e as aplicações atualizados
5. **Monitorar Acessos**: Revise os logs em busca de atividades suspeitas

### Proteção de Dados
- **Criptografar Dados Sensíveis**: Use criptografia para informações confidenciais
- **Proteger Backups**: Proteja os arquivos de backup com criptografia forte
- **Controle de Acesso**: Implemente o princípio do menor privilégio
- **Auditorias Regulares**: Revise e atualize as configurações de segurança

## Conclusão

O YunoHost fornece uma excelente base para servidores comunitários, oferecendo um equilíbrio entre simplicidade e funcionalidade. Seu extenso catálogo de aplicações, atualizações automáticas e recursos de segurança o tornam ideal para implantar e manter serviços comunitários com o mínimo de sobrecarga técnica.

Para recomendações de hardware, o YunoHost funciona bem em todas as plataformas da Community Box, com os modelos Raspberry Pi adequados para implantações menores e os sistemas Intel NUC lidando com ambientes maiores e multiusuário.

---

*Referências: Documentação oficial do YunoHost e recursos da comunidade[11][14]*