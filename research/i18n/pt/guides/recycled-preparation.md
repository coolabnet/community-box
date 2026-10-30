---
title: Preparação
sourcePath: guides/recycled-preparation.md
sourceHash: 2530d2ef46d16ed1
translatedBy: glm-4.6
---

---
title: Preparação
---

# Guia de Preparação de Computadores Reciclados

## Visão Geral

Este guia abrangente fornece instruções passo a passo para limpeza física, redefinição e preparação de computadores reciclados para implantação como servidores. A preparação adequada garante desempenho ideal, confiabilidade e longevidade do hardware reaproveitado.

## Precauções de Segurança

### Segurança Elétrica
- [ ] **Desligar Completamente**: Desligue o equipamento e desconecte da tomada
- [ ] **Descarregar o Botão de Energia**: Pressione e segure o botão de energia por 10 segundos após desconectar
- [ ] **Aguardar Descarga dos Capacitores**: Aguarde 5-10 minutos antes de abrir o gabinete
- [ ] **Remover Bateria**: Desconecte a bateria do laptop, se aplicável
- [ ] **Usar Proteção Antiestática**: Pulseira antiestática ou aterramento frequente

### Segurança Física
- [ ] **Área de Trabalho**: Espaço de trabalho limpo, bem iluminado e livre de estática
- [ ] **Proteção Ocular**: Óculos de segurança ao usar ar comprimido
- [ ] **Ventilação**: Fluxo de ar adequado para remoção de poeira
- [ ] **Arestas Cortantes**: Tenha cuidado com as bordas metálicas do gabinete
- [ ] **Levantamento**: Técnicas adequadas de levantamento para equipamentos pesados

### Considerações Ambientais
- [ ] **Limpeza ao Ar Livre**: Use ar comprimido ao ar livre quando possível
- [ ] **Contenção de Poeira**: Cubra equipamentos próximos durante a limpeza
- [ ] **Descarte**: Descarte adequado dos materiais de limpeza e componentes removidos

## Ferramentas e Materiais Necessários

### Ferramentas Essenciais
- **Chaves de Fenda**: Jogo de pontas Phillips (#0, #1, #2)
- **Ar Comprimido**: Várias latas ou compressor de ar elétrico
- **Materiais de Limpeza**: Álcool isopropílico (90%+), panos de microfibra
- **Equipamento de Segurança**: Pulseira antiestática, óculos de segurança
- **Organização**: Recipientes pequenos para parafusos, etiquetas para cabos

### Ferramentas Opcionais
- **Pasta Térmica**: Arctic MX-4 ou equivalente para reinstalar o CPU
- **Abraçadeiras de Cabo**: Para melhorar o gerenciamento de cabos
- **Chaves Torx**: Para alguns modelos de laptop
- **Ferramentas de Alavanca Plásticas**: Para desmontagem de laptops
- **Câmera Digital**: Para documentação antes da desmontagem

### Materiais de Limpeza
| Material | Finalidade | Observações de Segurança |
|----------|---------|--------------|
| Álcool Isopropílico 90%+ | Limpeza de componentes | Área bem ventilada |
| Panos de Microfibra | Limpeza de superfícies | Sem fiapos, antiestático |
| Cotonetes | Limpeza detalhada | Sem fibras de algodão deixadas para trás |
| Ar Comprimido | Remoção de poeira | Mantenha as latas na vertical, jatos curtos |
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
   - Close-ups das conexões de cabos
   - Posicionamento dos componentes antes da remoção
   - Quaisquer danos ou configurações incomuns

2. **Etiquetas e Marcações**:
   - Registre números de modelo e números de série
   - Anote quaisquer modificações personalizadas
   - Documente os percursos de passagem dos cabos
   - Identifique componentes proprietários

## Desmontagem de Computador de Mesa

### Etapa 1: Preparação Externa
1. **Desconecte Todos os Cabos**:
   - Cabo de alimentação
   - Cabos do monitor (VGA/HDMI/DisplayPort)
   - Dispositivos USB (teclado, mouse, etc.)
   - Cabo de rede
   - Cabos de áudio

2. **Remova Componentes Externos**:
   - Mídias ópticas das unidades
   - Dispositivos USB e cartões SD
   - Quaisquer acessórios conectados

### Etapa 2: Abertura do Gabinete
1. **Remoção do Painel Lateral**:
   ```
   Maioria dos gabinetes: Remova 2-4 parafusos de aperto manual no painel traseiro
   Gabinetes sem ferramentas: Pressione as travas e deslize o painel
   Gabinetes antigos: Parafusos Phillips no painel traseiro
   ```

2. **Verificação de Acesso**:
   - Garanta acesso livre a todos os componentes
   - Remova ambos os painéis laterais se necessário
   - Verifique se há painéis de acesso adicionais

### Etapa 3: Ordem de Remoção dos Componentes

#### Fonte de Alimentação (se precisar de substituição)
1. **Desconecte Todos os Cabos de Alimentação**:
   - Conector de 24 pinos da placa-mãe
   - Conector de alimentação do CPU de 4/8 pinos
   - Conectores de alimentação PCIe
   - Conectores de alimentação SATA
   - Conectores Molex

2. **Remova a Fonte**:
   - Desparafuse os 4 parafusos da parte traseira do gabinete
   - Remova cuidadosamente a unidade
   - Anote a orientação para reinstalação

#### Unidades de Armazenamento
1. **Remoção dos Cabos SATA/Alimentação**:
   - Desconecte delicadamente os cabos de dados SATA
   - Remova os conectores de alimentação SATA
   - Anote o percurso dos cabos para remontagem

2. **Remoção das Unidades**:
   ```
   HDDs de 3.5": 4 parafusos nas laterais da gaiola da unidade
   SSDs de 2.5": 4 parafusos do suporte de fixação
   Unidades M.2: Um único parafuso e levantamento suave
   ```

#### Placas de Expansão
1. **Remova em Ordem**:
   - Desparafuse os parafusos do suporte
   - Destrave as presilhas de retenção PCIe
   - Levante cuidadosamente as placas em linha reta para cima
   - Armazene em sacos antiestáticos

#### Memória (RAM)
1. **Processo de Remoção**:
   - Pressione para baixo as presilhas de retenção em ambas as extremidades
   - Os módulos de RAM vão se soltar em ângulo de 30 graus
   - Puxe delicadamente os módulos em linha reta para fora
   - Manuseie apenas pelas bordas

#### Dissipador do CPU (se limpeza/substituição)
1. **Remoção de Soquete Intel**:
   ```
   Coolers de pino-pressão: Gire os pinos 90° no sentido anti-horário, puxe para cima
   Coolers aparafusados: Remova os parafusos em padrão X
   ```

2. **Remoção de Soquete AMD**:
   ```
   Retenção por clipe: Levante a alavanca de retenção, deslize o cooler para fora
   Aparafusado: Remova os parafusos em padrão estrela
   ```

**⚠️ Aviso**: O CPU pode ficar preso ao dissipador devido à pasta térmica

## Desmontagem de Laptop

### Etapa 1: Preparação Externa
1. **Gerenciamento de Energia**:
   - Desligue completamente
   - Remova a bateria (se removível)
   - Desconecte o adaptador CA
   - Pressione o botão de energia por 15 segundos

2. **Limpeza Externa**:
   - Remova quaisquer dispositivos conectados
   - Limpe o exterior com pano de microfibra levemente umedecido
   - Preste atenção às áreas das portas

### Etapa 2: Remoção do Painel de Acesso
1. **Acesso pelo Painel Inferior**:
   ```
   Notebooks modernos: Remova todos os parafusos visíveis da parte inferior
   Notebooks antigos: Podem ter múltiplos painéis de acesso
   Alguns modelos: Requerem remoção do teclado ou do descanso de palmas primeiro
   ```

2. **Gerenciamento de Parafusos**:
   - Use recipientes pequenos para diferentes tipos de parafusos
   - Alguns laptops usam parafusos de comprimentos diferentes
   - Tire fotos das posições dos parafusos

### Etapa 3: Acesso aos Componentes

#### Memória e Armazenamento
1. **Módulos de RAM**:
   - Geralmente acessíveis pelo painel inferior
   - Solte as presilhas e os módulos se soltam em ângulo
   - Remova com cuidado puxando pelas bordas

2. **Unidades de Armazenamento**:
   ```
   SATA de 2.5": Remova os parafusos do suporte, desconecte o cabo
   M.2 NVMe: Remova o único parafuso, levante em ângulo
   mSATA: Similar ao M.2, mas com formato menor
   ```

#### Desmontagem Avançada (se necessário)
**Observação**: Prossiga apenas se tiver experiência em reparo de laptops

1. **Remoção do Teclado**:
   - Solte as presilhas ou remova os parafusos
   - Desconecte os cabos flat com cuidado
   - Alguns modelos exigem remover o descanso de palmas primeiro

2. **Conjunto da Tela**:
   - Remova os parafusos das dobradiças
   - Desconecte os cabos da tela e do Wi-Fi
   - Separe cuidadosamente o conjunto da tela

## Procedimentos de Limpeza

### Limpeza com Ar Comprimido
1. **Preparação**:
   - Leve o equipamento para fora ou para uma área bem ventilada
   - Use óculos de segurança
   - Mantenha as latas de ar comprimido na vertical
   - Use jatos curtos (2-3 segundos)

2. **Ordem de Limpeza**:
   ```
   1. Fonte de alimentação (se acessível)
   2. Dissipador e cooler do CPU
   3. Dissipador e cooler da placa de vídeo
   4. Cooler do gabinete (segure as pás do cooler enquanto sopra)
   5. Componentes da placa-mãe
   6. Slots de placas de expansão
   7. Baias de unidades e conectores
   ```

3. **Protocolo de Limpeza das Ventoinhas**:
   ```
   ⚠️ CRÍTICO: Mantenha as pás do cooler paradas durante a limpeza
   - Ar comprimido pode girar os coolers acima do RPM nominal
   - Giro excessivo pode danificar os rolamentos
   - Use um cotonete para segurar o centro do cooler se necessário
   ```

### Limpeza Detalhada

#### Limpeza da Placa-Mãe
1. **Limpeza de Superfície**:
   - Use pano de microfibra seco para poeira leve
   - Álcool isopropílico para resíduos persistentes
   - Cotonetes para espaços apertados
   - Nunca use água ou solventes agressivos

2. **Limpeza de Conectores**:
   ```
   Slots de RAM: Ar comprimido, escova macia
   Slots PCIe: Somente ar comprimido
   Soquete do CPU: Ar comprimido, extremo cuidado
   Conectores de alimentação: Álcool isopropílico nos contatos
   ```

#### Limpeza do Dissipador de Calor
1. **Remoção de Poeira**:
   - Ar comprimido de vários ângulos
   - Escove o acúmulo de poeira persistente
   - Garanta que todas as passagens entre as aletas estejam livres

2. **Remoção da Pasta Térmica** (se reinstalar o CPU):
   ```
   Materiais: Álcool isopropílico 90%+, filtros de café
   Processo: 
   1. Remova a pasta antiga com espátula de plástico
   2. Limpe com pano embebido em álcool
   3. Limpeza final com filtro de café
   4. Garanta que esteja completamente seco antes da nova pasta
   ```

### Limpeza do Gabinete e Exterior

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
   Secagem: Secagem imediata com pano limpo
   ```

2. **Superfícies Metálicas**:
   ```
   Solução: Álcool isopropílico 70%+
   Método: Aplicação com pano de microfibra
   Acabamento: Seque imediatamente para evitar manchas de água
   ```

## Teste e Substituição de Componentes

### Testes de Componentes Antes da Limpeza
1. **Inspeção Visual**:
   - Procure capacitores estufados
   - Verifique marcas de queimadura ou descoloração
   - Inspecione os cabos quanto a danos
   - Verifique a integridade das pás das ventoinhas

2. **Funcionalidade Básica**:
   - Teste a inicialização do sistema antes da desmontagem completa
   - Verifique se todas as ventoinhas giram
   - Verifique se há ruídos incomuns
   - Monitore as temperaturas se possível

### Verificação Após a Limpeza
1. **Reinstalação dos Componentes**:
   - RAM: Pressão firme e uniforme até as presilhas encaixarem
   - Placas PCIe: Pressione para baixo até a presilha de retenção estalar
   - Conectores de alimentação: Conexão firme, presilhas de retenção encaixadas
   - Cabos SATA: Conexão delicada, porém segura

2. **Gerenciamento de Cabos**:
   - Afaste os cabos das ventoinhas
   - Fixe os cabos soltos com abraçadeiras
   - Garanta que nenhum cabo obstrua o fluxo de ar
   - Verifique se todas as conexões estão seguras
## Procedimentos de Reset do BIOS/CMOS

### Quando Fazer Reset do BIOS
- Senhas do BIOS desconhecidas
- Configurações do BIOS corrompidas
- Problemas de compatibilidade de hardware
- Instabilidade após troca de componentes

### Substituição da Bateria CMOS
1. **Localização da Bateria**:
   ```
   Desktop: Normalmente visível na placa-mãe (CR2032)
   Notebook: Pode estar sob o teclado ou em painel acessível
   ```

2. **Processo de Substituição**:
   ```
   1. Desligue completamente e desconecte o sistema
   2. Remova a bateria CMOS (observe a orientação)
   3. Aguarde 5-10 minutos para descarga completa
   4. Instale a nova bateria (mantenha a orientação)
   5. Ligue o sistema e configure a BIOS
   ```

### Reset via Jumper CMOS (Desktop)
1. **Localizar o Jumper CMOS**:
   - Geralmente rotulado como "CLRTC", "CLEAR" ou "JBAT1"
   - Próximo à bateria CMOS ou ao chip do BIOS
   - Consulte o manual da placa-mãe em caso de dúvida

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

2. **Botão da Placa-Mãe** (sistemas mais novos):
   - Algumas placas têm botão dedicado de reset do CMOS
   - Pressione o botão com o sistema desligado
   - Não é necessária manipulação de jumpers

## Checklist de Controle de Qualidade

### Verificação Prévia à Remontagem
- [ ] Todos os componentes completamente limpos
- [ ] Nenhum componente danificado identificado
- [ ] Pasta térmica substituída (se a CPU foi removida)
- [ ] Todos os cabos e conectores limpos
- [ ] Nenhum objeto estranho deixado no gabinete
- [ ] Precauções antiestáticas mantidas

### Checklist de Remontagem
- [ ] Componentes instalados em ordem inversa à remoção
- [ ] Todos os parafusos devidamente apertados (sem apertar demais)
- [ ] Cabos organizados para fluxo de ar otimizado
- [ ] Nenhum cabo solto perto dos ventiladores
- [ ] Todas as conexões de energia firmes
- [ ] Memória RAM e placas de expansão totalmente encaixadas

### Teste Inicial de Ligação
- [ ] Sistema liga normalmente
- [ ] Todos os ventiladores girando (CPU, gabinete, GPU)
- [ ] Sem ruídos ou cheiros incomuns
- [ ] POST concluído com sucesso
- [ ] Todos os componentes detectados no BIOS
- [ ] Leituras de temperatura normais

## Problemas Comuns e Soluções

### Sistema Não Liga
**Possíveis Causas**:
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
**Possíveis Causas**:
- Pasta térmica não aplicada corretamente
- Cooler da CPU não devidamente encaixado
- Ventiladores não conectados
- Caminhos de fluxo de ar bloqueados

**Soluções**:
1. Verifique a fixação do cooler da CPU
2. Verifique a aplicação da pasta térmica
3. Confirme todas as conexões dos ventiladores
4. Verifique a orientação dos ventiladores do gabinete

### Problemas de Boot
**Possíveis Causas**:
- Reset do BIOS necessário
- Dispositivo de boot não detectado
- Conexões de armazenamento frouxas
- Setor de boot corrompido

**Soluções**:
1. Restaure o BIOS para os padrões
2. Verifique as conexões dos dispositivos de armazenamento
3. Verifique a ordem de boot no BIOS
4. Teste com outro dispositivo de armazenamento

## Documentação e Rotulagem

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
1. **Gerenciamento de Inventário**:
   - Rotule os componentes removidos
   - Rastreie os números de série dos componentes
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
   - Ative as configurações ideais para uso como servidor
   - Configure as prioridades de boot
   - Ative os recursos de virtualização
   - Defina as opções de gerenciamento de energia

2. **Burn-In de Hardware**:
   ```
   Teste de Estresse do CPU: 4-8 horas com 100% de carga
   Teste de Memória: Passagem completa no MemTest86+
   Teste de Armazenamento: Teste de resistência de leitura/escrita
   Monitoramento de Temperatura: Durante todos os testes
   ```

### Preparação para Implantação
- [ ] Mídia de instalação do sistema operacional preparada
- [ ] Pacotes de drivers baixados
- [ ] Configuração de rede planejada
- [ ] Configurações de segurança documentadas
- [ ] Procedimentos de backup e recuperação planejados

## Próximos Passos

1. **Configuração do BIOS**: Configure as configurações de BIOS/UEFI para operação como servidor
2. **Verificação de Compatibilidade**: Consulte [Verificação de Compatibilidade de Hardware](hardware-compatibility-check.md)
3. **Requisitos do Sistema**: Confirme [Requisitos para PCs Reciclados](recycled-pc-requirements.md)
4. **Seleção de Modelos**: Consulte [Comparação de Modelos Reciclados](recycled-models-comparison.md)

---

*Este guia de preparação garante que computadores reciclados sejam devidamente limpos, testados e estejam prontos para implantação confiável como servidor. Sempre priorize a segurança e dedique tempo para fazer o trabalho corretamente.*