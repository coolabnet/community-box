---
title: Configuração de DNS
sourcePath: guides/dns-configuration.md
sourceHash: 21ab7f5dec9d1b26
translatedBy: glm-4.6
---

# Configuração de DNS para LibreMesh

Este guia explica como configurar serviços DNS em redes LibreMesh para permitir acesso confiável a serviços locais, implementar cache e estabelecer nomes de domínio dentro da rede mesh.

## Introdução ao DNS em Redes Mesh

O Sistema de Nomes de Domínio (DNS) é um componente crítico de qualquer rede, traduzindo nomes de domínio legíveis por humanos em endereços IP. Em redes mesh, a configuração de DNS ganha importância adicional devido a:

- **Serviços Locais**: Necessidade de fornecer acesso a serviços hospedados dentro da mesh
- **Arquitetura Distribuída**: Múltiplos nós podem fornecer serviços em toda a rede
- **Operação Offline**: As redes devem funcionar mesmo sem conectividade com a internet
- **Restrições de Recursos**: Hardware limitado exige soluções de DNS eficientes

O LibreMesh usa o dnsmasq como seu serviço DNS principal, fornecendo uma solução leve e poderosa para redes mesh[36][37].

`[Network Diagram with Local DNS](local-dns-diagram.png) — Schematic showing flow of local DNS queries.]`

## Arquitetura DNS no LibreMesh

### Visão Geral dos Componentes

O sistema DNS no LibreMesh consiste em vários componentes integrados[37][38][40]:

1. **dnsmasq**: O servidor DNS principal e serviço DHCP
2. **Estado Compartilhado**: Mecanismo para distribuir informações de DNS entre os nós
3. **Configuração de Hosts**: Definições de nomes de host locais e em toda a rede
4. **Configuração de Domínio**: Configurações para domínios locais dentro da mesh

### Fluxo de Resolução

Quando um cliente na rede mesh faz uma consulta DNS[41]:

1. A solicitação primeiro vai para a instância local do dnsmasq no nó conectado
2. Se o domínio for local à mesh, ele é resolvido usando registros locais
3. Se for um domínio da internet e estiver em cache, o resultado em cache é retornado
4. Caso contrário, a consulta é encaminhada aos servidores DNS upstream
5. Se a conectividade com a internet estiver indisponível, apenas os domínios locais são resolvidos

## Configuração Básica de DNS

### Acessando as Configurações de DNS

A configuração de DNS no LibreMesh pode ser modificada através de vários métodos[55]:

1. **Interface Web**: Configurações limitadas de DNS estão disponíveis através da interface web do LibreMesh
2. **Configuração UCI**: Edite as configurações usando UCI (Unified Configuration Interface)
3. **Edição Direta de Arquivos**: Modifique os arquivos de configuração em `/etc/config/`

### Arquivos de Configuração

Os principais arquivos de configuração para DNS no LibreMesh são[37][38]:

- **/etc/config/dhcp**: Contém a configuração do dnsmasq
- **/etc/config/lime**: Configuração principal do LibreMesh que afeta o comportamento do DNS
- **/etc/hosts**: Definições locais de nomes de host
- **/etc/dnsmasq.d/**: Fragmentos adicionais de configuração

`[LibreMesh DNS Config Screenshot](libremesh-dns-config.png) — Web UI or config file with DNS settings highlighted.]`

## Configurando Resolução DNS Local

### Configurando Hosts Estáticos

Para adicionar entradas de hosts estáticos para serviços locais[36][38]:

1. **Via SSH**: Conecte-se ao nó LibreMesh via SSH:
   ```
   ssh root@thisnode.info
   ```

2. **Editar Arquivo de Hosts**: Adicione entradas em `/etc/hosts`:
   ```
   vi /etc/hosts
   ```
   
   Adicione linhas no formato:
   ```
   192.168.1.10   mediaserver.mesh
   192.168.1.20   wiki.mesh
   ```

3. **Reiniciar o Serviço DNS**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Usando dnsmasq-distributed-hosts

O LibreMesh inclui um pacote chamado dnsmasq-distributed-hosts que compartilha informações de nomes de host pela mesh[25]:

1. **Verificar Instalação do Pacote**:
   ```
   opkg list-installed | grep dnsmasq-distributed
   ```

2. **Configurar a Distribuição de Hosts**:
   Edite `/etc/config/lime-community` para habilitar a distribuição de hosts:
   ```
   config lime network
       option dns_distributed_hosts '1'
   ```

3. **Adicionar Serviços Locais**: Registre serviços locais em seus respectivos nós usando o arquivo de hosts

## Implementando Aliases de Domínio

### Nomes de Domínio Personalizados para Serviços Locais

Para criar nomes de domínio amigáveis para serviços locais[25]:

1. **Criar Configuração de Aliases de Domínio**:
   ```
   vi /etc/config/domain-aliases
   ```

2. **Adicionar Aliases de Domínio**:
   ```
   config alias
       option domain 'community.portal'
       option target '192.168.1.100'
   
   config alias
       option domain 'local.library'
       option target '192.168.1.101'
   ```

3. **Aplicar a Configuração**:
   ```
   /etc/init.d/domain-aliases restart
   ```

### Extensões de Domínio

O LibreMesh normalmente usa estas extensões de domínio para serviços locais[41]:

- **.mesh**: Para serviços em toda a mesh
- **.local**: Para serviços específicos de um nó
- **.lan**: Para serviços da rede local

## Configuração de Cache DNS

### Otimizando as Configurações de Cache

O cache DNS melhora o desempenho armazenando resultados recentes de consultas[38][40]:

1. **Editar a Configuração do dnsmasq**:
   ```
   vi /etc/config/dhcp
   ```

2. **Configurar o Tamanho do Cache**:
   ```
   config dnsmasq
       option cachesize '1000'
       option min_cache_ttl '3600'
   ```

3. **Aplicar as Alterações**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### NodeLocal DNS Cache

Para implantações maiores, implemente um cache DNS local no nó para reduzir a latência das consultas[40]:

1. **Instalar os Pacotes Necessários**:
   ```
   opkg update
   opkg install dns-cache-local
   ```

2. **Configurar o Encaminhamento**:
   ```
   vi /etc/config/dns-cache-local
   ```
   
   Adicione:
   ```
   config dns-cache-local
       option enabled '1'
       option cache_size '10000'
   ```

3. **Reiniciar os Serviços**:
   ```
   /etc/init.d/dns-cache-local restart
   ```

## Operação DNS Offline

### Garantindo Resiliência Local

Configure o DNS para operar de forma confiável sem conectividade com a internet[41]:

1. **Configurar o Domínio Local**:
   ```
   vi /etc/config/dhcp
   ```
   
   Adicione:
   ```
   config dnsmasq
       option local '/mesh/'
       option domain 'mesh'
       option expandhosts '1'
   ```

2. **Definir Modo Autoritativo**:
   ```
   config dnsmasq
       option authoritative '1'
   ```

3. **Desabilitar o Encaminhamento DNS Quando Offline**:
   ```
   config dnsmasq
       option nonwildcard '1'
       option filterwin2k '1'
   ```

## Configurações Avançadas de DNS

### Suporte a Múltiplos Domínios

Para suportar múltiplos domínios locais[36]:

1. **Configurar as Definições de Domínio**:
   ```
   config dnsmasq
       list local '/mesh/'
       list local '/community/'
       list local '/services/'
   ```

2. **Configurar o Comportamento do Domínio**:
   ```
   config dnsmasq
       option domain 'mesh'
       option expand_hosts '1'
       option local_service '1'
   ```

### Integração com DNS Externo

Para redes com conectividade com a internet[38]:

1. **Configurar os Servidores DNS Upstream**:
   ```
   config dnsmasq
       list server '8.8.8.8'
       list server '1.1.1.1'
   ```

2. **Configurar o Encaminhamento Inteligente**:
   ```
   config dnsmasq
       option all_servers '1'
       option sequential_ip '1'
   ```

## Recursos Especiais de DNS do LibreMesh

### Domínio thisnode.info

O LibreMesh implementa um domínio especial chamado "thisnode.info" que sempre resolve para o nó atual[41]:

1. Este domínio funciona em todos os nós da rede
2. Acessar http://thisnode.info sempre abre a interface web do nó local
3. Este recurso simplifica a administração dos nós

### Estado Compartilhado para DNS

O LibreMesh usa um sistema de estado compartilhado para distribuir informações de DNS[37]:

1. **Habilitar o Estado Compartilhado**:
   ```
   config lime network
       option use_shared_state '1'
   ```

2. **Configurar o Compartilhamento de Estado**:
   ```
   config lime shared_state
       option sharing_strategy 'all'
       option shared_data 'hosts dnsmasq-lease'
   ```

## Solução de Problemas de DNS

### Problemas Comuns e Soluções

#### Nomes de Domínio Não Resolvem

1. **Verificar o Serviço dnsmasq**:
   ```
   /etc/init.d/dnsmasq status
   ```

2. **Verificar a Configuração**:
   ```
   cat /etc/config/dhcp
   ```

3. **Testar a Resolução**:
   ```
   nslookup local.service 127.0.0.1
   ```

4. **Verificar os Logs**:
   ```
   logread | grep dnsmasq
   ```

#### Problemas de Propagação de DNS

Se as entradas de DNS não estiverem se propagando pela mesh:

1. **Verificar o Estado Compartilhado**:
   ```
   cat /tmp/shared-state/dnsmasq-hosts
   ```

2. **Verificar a Conectividade da Mesh**:
   ```
   ping othernode.mesh
   ```

3. **Reiniciar o Serviço de Estado Compartilhado**:
   ```
   /etc/init.d/shared-state restart
   ```

#### Resolução Lenta

Para resolução DNS lenta:

1. **Otimizar as Configurações de Cache**:
   ```
   config dnsmasq
       option cachesize '2000'
       option min_cache_ttl '7200'
   ```

2. **Verificar Vazamentos de DNS**:
   ```
   tcpdump -i any port 53
   ```

## Substituindo o dnsmasq

O LibreMesh atualmente usa o dnsmasq tanto para DNS quanto para DHCP, mas há planos para separar essas funções[37]:

1. **Status Atual**: o dnsmasq gerencia tanto o DNS quanto o DHCP nas versões atuais do LibreMesh
2. **Planos Futuros**: o odhcpd pode substituir a funcionalidade de DHCP, mantendo o dnsmasq para DNS
3. **Compatibilidade**: Quaisquer alterações manterão a compatibilidade retroativa com as configurações existentes

## Melhores Práticas para DNS no LibreMesh

### Otimização de Desempenho

1. **Dimensionar o Cache Adequadamente**: Ajuste o tamanho do cache com base na memória do nó (maior para nós de gateway)
2. **Minimizar Sobrescritas de TTL**: Sobrescreva o TTL apenas para recursos frequentemente acessados
3. **Usar Domínios Locais**: Mantenha os serviços específicos da mesh sob nomes de domínio consistentes

### Considerações de Segurança

1. **Restringir Transferências de Zona**: Limite as transferências de zona apenas aos nós da mesh
2. **Implementar Filtragem DNS**: Considere filtragem de conteúdo baseada em DNS para políticas da comunidade
3. **Proteger os Arquivos de Configuração**: Proteja a configuração de DNS contra alterações não autorizadas

### Planejamento de Escalabilidade

1. **Estrutura Hierárquica**: Para redes grandes, implemente uma estrutura de DNS hierárquica
2. **Distribuição de Carga**: Distribua o serviço de DNS entre múltiplos nós mais potentes
3. **Monitoramento**: Implemente monitoramento de consultas DNS para identificar problemas de desempenho

## Exemplos de Implementação

### Rede Comunitária Pequena

Para uma rede de 5 a 10 nós:
```
config dnsmasq
    option domain 'ourcomm.mesh'
    option expandhosts '1'
    option local '/ourcomm.mesh/'
    option cachesize '500'
```

### Rede Comunitária Média

Para uma rede de 20 a 50 nós:
```
config dnsmasq
    option domain 'communitynet.mesh'
    option expandhosts '1'
    option local '/communitynet.mesh/'
    option local '/services.communitynet.mesh/'
    option cachesize '1000'
    option all_servers '1'
```

### Rede Comunitária Grande

Para uma rede de 100+ nós, implemente um DNS hierárquico com servidores DNS primário e secundário em nós mais potentes.
## Próximos Passos

Para continuar o desenvolvimento da sua rede LibreMesh:

- Consulte [libremesh-overview.md](./libremesh-overview.md) para um contexto mais amplo
- Veja [mesh-network-basics.md](./mesh-network-basics.md) para os fundamentos de redes
- Siga [libremesh-installation.md](./libremesh-installation.md) para orientações de hardware e configuração

Ao implementar um sistema de DNS bem configurado, você melhorará a usabilidade, o desempenho e a resiliência da sua rede LibreMesh, possibilitando acesso contínuo tanto a recursos locais quanto à internet.