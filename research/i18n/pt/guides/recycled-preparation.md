---
title: Preparação
sourcePath: guides/recycled-preparation.md
sourceHash: 1ba0219d4fcbd386
translatedBy: glm-4.6
---

# Guia de Preparação de Computadores Reciclados

## Visão Geral

Este guia completo fornece instruções passo a passo para limpeza física, redefinição e preparação de computadores reciclados para implantação como servidores. Uma preparação adequada garante desempenho ideal, confiabilidade e longevidade do hardware reaproveitado.

## Precauções de Segurança

### Segurança Elétrica
- [ ] **Desligar Completamente**: Desligue o equipamento e desconecte da tomada
- [ ] **Descarregar o Botão de Energia**: Pressione e segure o botão de energia por 10 segundos após desconectar
- [ ] **Aguardar Descarga dos Capacitores**: Aguarde 5-10 minutos antes de abrir o gabinete
- [ ] **Remover a Bateria**: Desconecte a bateria do laptop, se aplicável
- [ ] **Usar Proteção Antiestática**: Pulseira antiestática ou aterramento frequente

### Segurança Física
- [ ] **Área de Trabalho**: Espaço limpo, bem iluminado e livre de eletricidade estática
- [ ] **Proteção Ocular**: Use óculos de segurança ao usar ar comprimido
- [ ] **Ventilação**: Fluxo de ar adequado para remoção de poeira
- [ ] **Bordas Cortantes**: Tenha cuidado com as bordas metálicas do gabinete
- [ ] **Levantamento de Peso**: Use técnicas adequadas para equipamentos pesados

### Considerações Ambientais
- [ ] **Limpeza ao Ar Livre**: Use ar comprimido ao ar livre quando possível
- [ ] **Contenção de Poeira**: Cubra equipamentos próximos durante a limpeza
- [ ] **Descarte**: Descarte adequadamente os materiais de limpeza e componentes removidos

## Ferramentas e Materiais Necessários

### Ferramentas Essenciais
- **Chaves de Fenda**: Jogo Phillips (#0, #1, #2)
- **Ar Comprimido**: Várias latas ou compressor de ar elétrico
- **Materiais de Limpeza**: Álcool isopropílico (90%+), panos de microfibra
- **Equipamentos de Segurança**: Pulseira antiestática, óculos de segurança
- **Organização**: Recipientes pequenos para parafusos, etiquetas para cabos

### Ferramentas Opcionais
- **Pasta Térmica**: Arctic MX-4 ou equivalente para refixar o CPU
- **Abraçadeiras de Cabo**: Para melhorar o gerenciamento de cabos
- **Chaves Torx**: Para alguns modelos de laptop
- **Ferramentas de Alavanca Plásticas**: Para desmontagem de laptops
- **Câmera Digital**: Para documentação antes da desmontagem

### Materiais de Limpeza
| Material | Finalidade | Observações de Segurança |
|----------|---------|--------------|
| Álcool Isopropílico 90%+ | Limpeza de componentes | Área bem ventilada |
| Panos de Microfibra | Limpeza de superfícies | Sem fiapos, antiestático |
| Cotonetes | Limpeza de detalhes | Não deixar fibras de algodão |
| Ar Comprimido | Remoção de poeira | Segurar as latas na vertical, rajadas curtas |
| Pincel de Cerdas Macias | Poeira persistente | Prefira pincéis antiestáticos |

## Documentação Pré-Desmontagem

### Coleta de Informações do Sistema
```bash
# Before powering down, collect system information
# Windows
msinfo32                    # System Information
dxdiag                     # DirectX Diagnostics
devmgmt.msc               # Device Manager

# Linux
lshw -html > hardware.html # Hardware listing
dmidecode > dmidecode.txt  # Hardware details
lscpu > cpu_info.txt      # CPU information
```

### Documentação Física
1. **Fotografia**:
   - Fotos gerais do sistema de vários ângulos
   - Detalhes das conexões de cabos
   - Posicionamento dos componentes antes da remoção
   - Quaisquer danos ou configurações incomuns

2. **Etiquetas e Marcações**:
   - Anote os números de modelo e números de série
   - Registre quaisquer modificações personalizadas
   - Documente os trajetos de passagem dos cabos
   - Identifique componentes proprietários

## Desmontagem de Computador de Mesa

### Etapa 1: Preparação Externa
1. **Desconectar Todos os Cabos**:
   - Cabo de alimentação
   - Cabos do monitor (VGA/HDMI/DisplayPort)
   - Dispositivos USB (teclado, mouse, etc.)
   - Cabo de rede
   - Cabos de áudio

2. **Remover Componentes Externos**:
   - Mídias ópticas das unidades
   - Dispositivos USB e cartões SD
   - Quaisquer acessórios conectados

### Etapa 2: Abertura do Gabinete
1. **Remoção do Painel Lateral**:
   ```
   Na maioria dos gabinetes: Remova 2-4 parafusos de aperto manual no painel traseiro
   Gabinetes sem ferramentas: Pressione as travas e deslize o painel
   Gabinetes antigos: Parafusos Phillips no painel traseiro
   ```

2. **Verificação de Acesso**:
   - Garanta acesso livre a todos os componentes
   - Remova ambos os painéis laterais, se necessário
   - Verifique se há painéis de acesso adicionais

### Etapa 3: Ordem de Remoção dos Componentes

#### Fonte de Alimentação (se precisar ser substituída)
1. **Desconectar Todos os Cabos de Alimentação**:
   - Conector de 24 pinos da placa-mãe
   - Conector de alimentação do CPU de 4/8 pinos
   - Conectores de alimentação PCIe
   - Conectores de alimentação SATA
   - Conectores Molex

2. **Remover a Fonte**:
   - Desparafuse os 4 parafusos na parte traseira do gabinete
   - Remova a unidade com cuidado
   - Anote a orientação para reinstalação

#### Unidades de Armazenamento
1. **Remoção dos Cabos SATA/Alimentação**:
   - Desconecte delicadamente os cabos de dados SATA
   - Remova os conectores de alimentação SATA
   - Anote o trajeto dos cabos para a remontagem

2. **Remoção das Unidades**:
   ```
   HDDs de 3.5": 4 parafusos nas laterais da gaiola da unidade
   SSDs de 2.5": 4 parafusos do suporte de montagem
   Unidades M.2: Um único parafuso e levantamento suave
   ```

#### Placas de Expansão
1. **Remover em Ordem**:
   - Desparafuse os parafusos do suporte
   - Destrave as presilhas de retenção PCIe
   - Levante as placas cuidadosamente em linha reta para cima
   - Armazene em sacos antiestáticos

#### Memória (RAM)
1. **Processo de Remoção**:
   - Pressione as presilhas de retenção nas duas extremidades
   - Os módulos de RAM vão saltar em um ângulo de 30 graus
   - Puxe os módulos delicadamente em linha reta
   - Manuseie apenas pelas bordas

#### Dissipador do CPU (se limpar/substituir)
1. **Remoção em Soquete Intel**:
   ```
   Coolers de pino de pressão: Gire os pinos 90° no sentido anti-horário, puxe para cima
   Coolers parafusados: Remova os parafusos em padrão X
   ```

2. **Remoção em Soquete AMD**:
   ```
   Retenção por clipe: Levante o braço de retenção, deslize o cooler para fora
   Parafusado: Remova os parafusos em padrão estrela
   ```

**⚠️ Aviso**: O CPU pode ficar grudado no dissipador devido à pasta térmica

## Desmontagem de Laptop

### Etapa 1: Preparação Externa
1. **Gerenciamento de Energia**:
   - Desligue completamente
   - Remova a bateria (se removível)
   - Desconecte o adaptador CA
   - Pressione o botão de energia por 15 segundos

2. **Limpeza Externa**:
   - Remova quaisquer dispositivos conectados
   - Limpe o exterior com um pano de microfibra levemente umedecido
   - Preste atenção às áreas das portas

### Etapa 2: Remoção do Painel de Acesso
1. **Acesso pelo Painel Inferior**:
   ```
   Notebooks modernos: Remova todos os parafusos visíveis da parte inferior
   Notebooks antigos: Podem ter vários painéis de acesso
   Alguns modelos: Requerem remoção do teclado ou do repouso de palmas primeiro
   ```

2. **Gerenciamento de Parafusos**:
   - Use recipientes pequenos para diferentes tipos de parafuso
   - Alguns laptops usam parafusos de comprimentos diferentes
   - Fotografe as posições dos parafusos

### Etapa 3: Acesso aos Componentes

#### Memória e Armazenamento
1. **Módulos de RAM**:
   - Geralmente acessíveis pelo painel inferior
   - Libere as presilhas e os módulos saltam em ângulo
   - Remova com cuidado puxando pelas bordas

2. **Unidades de Armazenamento**:
   ```
   SATA de 2.5": Remova os parafusos do suporte, desconecte o cabo
   M.2 NVMe: Remova o único parafuso, levante em ângulo
   mSATA: Semelhante ao M.2, mas com formato menor
   ```

#### Desmontagem Avançada (se necessário)
**Observação**: Prossiga apenas se tiver experiência com reparos em laptops

1. **Remoção do Teclado**:
   - Libere as presilhas ou remova os parafusos
   - Desconecte os cabos flat com cuidado
   - Alguns modelos exigem remover o apoio de palmas primeiro

2. **Conjunto da Tela**:
   - Remova os parafusos das dobradiças
   - Desconecte os cabos da tela e do Wi-Fi
   - Separe cuidadosamente o conjunto da tela

## Procedimentos de Limpeza

### Limpeza com Ar Comprimido
1. **Preparação**:
   - Leve o equipamento para fora ou para uma área bem ventilada
   - Use óculos de segurança
   - Segure as latas de ar comprimido na vertical
   - Use rajadas curtas (2-3 segundos)

2. **Ordem de Limpeza**:
   ```
   1. Fonte de alimentação (se acessível)
   2. Dissipador e ventoinha do CPU
   3. Dissipador e ventoinha da placa de vídeo
   4. Ventoinhas do gabinete (segure as pás da ventoinha enquanto sopra ar)
   5. Componentes da placa-mãe
   6. Slots de placas de expansão
   7. Baias de unidades e conectores
   ```

3. **Protocolo de Limpeza de Ventoinhas**:
   ```
   ⚠️ CRÍTICO: Mantenha as pás da ventoinha paradas durante a limpeza
   - Ar comprimido pode girar as ventoinhas além do RPM nominal
   - Girar demais pode danificar os rolamentos
   - Use um cotonete para segurar o centro da ventoinha, se necessário
   ```

### Limpeza de Detalhes

#### Limpeza da Placa-Mãe
1. **Limpeza de Superfície**:
   - Use pano de microfibra seco para poeira leve
   - Álcool isopropílico para resíduos persistentes
   - Cotonetes para espaços apertados
   - Nunca use água ou solventes agressivos

2. **Limpeza de Conectores**:
   ```
   Slots de RAM: Ar comprimido, escova suave
   Slots PCIe: Apenas ar comprimido
   Soquete do CPU: Ar comprimido, cuidado extremo
   Conectores de alimentação: Álcool isopropílico nos contatos
   ```

#### Limpeza do Dissipador de Calor
1. **Remoção de Poeira**:
   - Ar comprimido de vários ângulos
   - Escove o acúmulo de poeira persistente
   - Garanta que todas as passagens das aletas estejam livres

2. **Remoção da Pasta Térmica** (se refixar o CPU):
   ```
   Materiais: Álcool isopropílico 90%+, filtros de café
   Processo: 
   1. Remova a pasta antiga com espátula de plástico
   2. Limpe com pano embebido em álcool
   3. Limpeza final com filtro de café
   4. Garanta secagem completa antes da nova pasta
   ```

### Limpeza do Gabinete e Externa

#### Limpeza Interna do Gabinete
1. **Remoção de Poeira**:
   - Ar comprimido para poeira solta
   - Pano de microfibra para superfícies
   - Cotonetes para cantos e frestas

2. **Gerenciamento de Cabos**:
   - Remova a poeira dos feixes de cabos
   - Reorganize para melhor fluxo de ar
   - Substitua abraçadeiras de cabo danificadas

#### Limpeza Externa
1. **Superfícies Plásticas**:
   ```
   Solução: Sabão neutro e água ou álcool isopropílico
   Método: Pano úmido, não encharcado
   Secagem: Secar imediatamente com pano limpo
   ```

2. **Superfícies Metálicas**:
   ```
   Solução: Álcool isopropílico 70%+
   Método: Aplicação com pano de microfibra
   Acabamento: Seque imediatamente para evitar manchas de água
   ```

## Testes e Substituição de Componentes

### Testes de Componentes Antes da Limpeza
1. **Inspeção Visual**:
   - Procure capacitores estufados
   - Verifique marcas de queimado ou descoloração
   - Inspecione os cabos quanto a danos
   - Verifique a integridade das pás das ventoinhas

2. **Funcionalidade Básica**:
   - Teste a inicialização do sistema antes da desmontagem completa
   - Verifique se todas as ventoinhas giram
   - Verifique se há ruídos incomuns
   - Monitore as temperaturas, se possível

### Verificação Após a Limpeza
1. **Reencaixe de Componentes**:
   - RAM: Pressão firme e uniforme até as presilhas encaixarem
   - Placas PCIe: Pressione para baixo até a presilha de retenção clicar
   - Conectores de alimentação: Conexão firme, presilhas de retenção encaixadas
   - Cabos SATA: Conexão delicada, mas segura

2. **Gerenciamento de Cabos**:
   - Afaste os cabos das ventoinhas
   - Prenda os cabos soltos com abraçadeiras
   - Garanta que nenhum cabo obstrua o fluxo de ar
   - Verifique se todas as conexões estão firmes
## Procedimentos de Reset do BIOS/CMOS

### Quando Fazer Reset do BIOS
- Senhas de BIOS desconhecidas
- Configurações do BIOS corrompidas
- Problemas de compatibilidade de hardware
- Instabilidade após mudanças de componentes

### Substituição da Bateria CMOS
1. **Localização da Bateria**:
   ```
   Desktop: Geralmente visível na placa-mãe (CR2032)
   Notebook: Pode estar sob o teclado ou em um painel de acesso
   ```

2. **Processo de Substituição**:
   ```
   1. Desligue completamente o sistema e desconecte da tomada
   2. Remova a bateria CMOS (observe a orientação)
   3. Aguarde 5-10 minutos para descarga completa
   4. Instale a bateria nova (respeitando a orientação)
   5. Ligue o sistema e configure o BIOS
   ```

### Reset via Jumper CMOS (Desktop)
1. **Localizar o Jumper CMOS**:
   - Geralmente rotulado "CLRTC", "CLEAR", ou "JBAT1"
   - Próximo à bateria CMOS ou chip do BIOS
   - Consulte o manual da placa-mãe se houver dúvida

2. **Processo de Reset**:
   ```
   1. Desligue e desconecte o sistema
   2. Mova o jumper dos pinos 1-2 para os pinos 2-3
   3. Aguarde 10-15 segundos
   4. Retorne o jumper à posição original (1-2)
   5. Ligue o sistema
   ```

### Métodos Alternativos de Reset
1. **Método do Botão de Energia**:
   ```
   1. Desconecte o sistema completamente
   2. Remova a bateria CMOS
   3. Segure o botão de energia por 30 segundos
   4. Reinstale a bateria e ligue o sistema
   ```

2. **Botão da Placa-Mãe** (sistemas mais recentes):
   - Algumas placas possuem botão dedicado de reset do CMOS
   - Pressione o botão com o sistema desligado
   - Não é necessário manipular jumpers

## Checklist de Controle de Qualidade

### Verificação Prévia à Remontagem
- [ ] Todos os componentes totalmente limpos
- [ ] Nenhum componente danificado identificado
- [ ] Pasta térmica substituída (se a CPU foi removida)
- [ ] Todos os cabos e conectores limpos
- [ ] Nenhum objeto estranho deixado no gabinete
- [ ] Precauções antiestáticas mantidas

### Checklist de Remontagem
- [ ] Componentes instalados na ordem inversa da remoção
- [ ] Todos os parafusos corretamente apertados (sem apertar demais)
- [ ] Cabos organizados para fluxo de ar otimizado
- [ ] Nenhum cabo solto perto das ventoinhas
- [ ] Todas as conexões de energia firmes
- [ ] Memória RAM e placas de expansão totalmente encaixadas

### Teste Inicial de Ligamento
- [ ] Sistema liga normalmente
- [ ] Todas as ventoinhas girando (CPU, gabinete, GPU)
- [ ] Nenhum ruído ou cheiro estranho
- [ ] POST concluído com sucesso
- [ ] Todos os componentes detectados no BIOS
- [ ] Leituras de temperatura normais

## Problemas Comuns e Soluções

### Sistema Não Liga
**Causas Possíveis**:
- Conexões de energia frouxas
- RAM incorretamente encaixada
- Conectores do painel frontal desconectados
- Problemas na fonte de alimentação

**Soluções**:
1. Verifique todas as conexões de energia
2. Reencaixe os módulos de RAM
3. Verifique o alinhamento dos conectores do painel frontal
4. Teste com configuração mínima

### Superaquecimento Após a Limpeza
**Causas Possíveis**:
- Pasta térmica não aplicada corretamente
- Cooler da CPU não corretamente assentado
- Ventoinhas não conectadas
- Fluxo de ar bloqueado

**Soluções**:
1. Verifique a fixação do cooler da CPU
2. Confira a aplicação da pasta térmica
3. Confirme todas as conexões das ventoinhas
4. Verifique a orientação das ventoinhas do gabinete

### Problemas de Boot
**Causas Possíveis**:
- Reset do BIOS necessário
- Dispositivo de boot não detectado
- Conexões de armazenamento frouxas
- Setor de boot corrompido

**Soluções**:
1. Restaure o BIOS para os padrões de fábrica
2. Verifique as conexões dos dispositivos de armazenamento
3. Confira a ordem de boot no BIOS
4. Teste com outro dispositivo de armazenamento

## Documentação e Etiquetagem

### Documentação do Sistema
1. **Criar Registro de Serviço**:
   ```
   Modelo do Sistema: _______________
   Número de Série: ______________
   Data da Limpeza: ______________
   Técnico: ________________
   Componentes Substituídos: ________
   Problemas Encontrados: ______________
   ```

2. **Documentação Fotográfica**:
   - Fotos antes e depois da limpeza
   - Documentação de qualquer dano ou desgaste
   - Fotos da configuração dos componentes

### Rastreamento de Componentes
1. **Gestão de Inventário**:
   - Etiquete os componentes removidos
   - Registre os números de série dos componentes
   - Anote informações de compatibilidade
   - Registre os resultados dos testes de desempenho

2. **Notas de Configuração**:
   - Modificações nas configurações do BIOS
   - Alterações na configuração de hardware
   - Requisitos de drivers
   - Problemas de compatibilidade conhecidos

## Etapas Finais de Preparação

### Otimização do Sistema
1. **Configuração do BIOS**:
   - Ative as configurações otimizadas para uso como servidor
   - Configure as prioridades de boot
   - Ative os recursos de virtualização
   - Defina as opções de gerenciamento de energia

2. **Burn-In de Hardware**:
   ```
   CPU Stress Test: 4-8 hours at 100% load
   Memory Test: Full MemTest86+ pass
   Storage Test: Read/write endurance test
   Temperature Monitoring: Throughout all tests
   ```

### Preparação para Implantação
- [ ] Mídia de instalação do sistema operacional preparada
- [ ] Pacotes de drivers baixados
- [ ] Configuração de rede planejada
- [ ] Configurações de segurança documentadas
- [ ] Procedimentos de backup e recuperação planejados

## Próximos Passos

1. **Configuração do BIOS**: Configure as opções do BIOS/UEFI para operação como servidor
2. **Verificação de Compatibilidade**: Consulte [Verificação de Compatibilidade de Hardware](hardware-compatibility-check.md)
3. **Requisitos do Sistema**: Confirme [Requisitos para PCs Reciclados](recycled-pc-requirements.md)
4. **Seleção de Modelos**: Consulte [Comparação de Modelos Reciclados](recycled-models-comparison.md)

---

*Este guia de preparação garante que computadores reciclados estejam devidamente limpos, testados e prontos para implantação confiável como servidor. Sempre priorize a segurança e reserve tempo para fazer o trabalho corretamente.*