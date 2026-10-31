---
title: Pacotes de Idiomas do Kiwix
sourcePath: guides/kiwix-language-packs.md
sourceHash: ea224c1530d1dc6d
translatedBy: glm-4.6
---

# Escolhendo Pacotes de Idiomas do Kiwix para Wikipédia Offline

O Kiwix oferece cópias offline de sites, principalmente a Wikipédia. O projeto é uma organização sem fins lucrativos. O próprio site diz que trabalha para tornar [o conhecimento livre acessível onde a Internet não chega](https://kiwix.org/en/). Um pacote de conteúdo do Kiwix é um único arquivo grande chamado arquivo ZIM. Copie-o para um dispositivo e leia-o sem internet.

Este guia ajuda você a escolher um pacote de idiomas para um servidor ou caixa comunitária. Ele não testa o leitor no seu hardware. Teste antes de implantar.

## O que o Kiwix Oferece

O site do Kiwix lista um aplicativo leitor, um catálogo de conteúdo e opções de servidor ([página inicial do Kiwix](https://kiwix.org/en/)). Verifique as páginas de download das plataformas que você precisa.

## Encontrando um Pacote de Idiomas

A biblioteca do Kiwix é o catálogo de arquivos ZIM. O endereço dela é library.kiwix.org. O site da biblioteca bloqueou o acesso automatizado durante esta pesquisa, então os passos abaixo são inferidos. Verifique-os no site ao vivo.

1. Abra o catálogo e filtre por idioma.
2. Escolha a entrada da Wikipédia para esse idioma. Cada idioma tem sua própria edição da Wikipédia.
3. Anote o código do idioma no nome do arquivo. Exemplos: pt para português, es para espanhol, sw para suaíli, qu para quéchua, gn para guarani.

A listagem bruta de arquivos está em [download.kiwix.org](https://lb.download.kiwix.org/zim/wikipedia/). Ela mostra cada arquivo, sua data e seu tamanho.

## O que os Nomes de Variantes Significam

Cada idioma da Wikipédia tem até três variantes na listagem de arquivos: nopic, mini e maxi.

O FAQ do Kiwix as define ([FAQ do Kiwix: o que mini, nopic e maxi significam](https://get.kiwix.org/en/faq-items/what-do-mini-nopic-and-maxi-mean-in-the-wikipedia-zim-files/)):

- **maxi** é a versão completa padrão. Ela contém artigos completos com imagens. (o FAQ diz que nopic remove as imagens, então maxi as mantém)
- **nopic** contém artigos completos sem imagens. É a escolha usual para uso offline.
- **mini** contém apenas a introdução de cada artigo mais a caixa de informações (infobox).

## Tamanhos de Exemplo

Esses tamanhos vêm da listagem de arquivos em download.kiwix.org. Cada novo dump altera os tamanhos.

| Idioma | Código | Mini | Nopic | Maxi |
|---|---|---|---|---|
| Português | pt | 1.6 GB (2026-05) | 6.6 GB (2026-05) | 19 GB (2026-05) |
| Espanhol | es | 3.8 GB (2026-10) | 12 GB (2026-10) | 34 GB (2026-10) |
| Suaíli | sw | not listed | 248 MB (2026-10) | 713 MB (2026-10) |
| Quéchua | qu | not listed | 57 MB (2026-10) | 229 MB (2026-10) |
| Guarani | gn | not listed | 14 MB (2026-10) | 64 MB (2026-10) |

Suaíli, quéchua e guarani não têm arquivo mini na listagem. Idiomas menores têm pacotes pequenos. O tamanho pequeno também pode significar menos artigos. (inferido; compare as contagens de artigos em cada edição da Wikipédia)

Não verificamos pacotes para idiomas asiáticos. Veja Questões em Aberto.

## Planejando o Armazenamento

- Dimensione o disco para todos os pacotes que planeja manter, mais o maior arquivo de substituição que você baixar junto com eles durante uma atualização. O arquivo antigo permanece até que o novo seja verificado, então ambos existem ao mesmo tempo.
- Exemplo: espanhol nopic (12 GB) mais português maxi (19 GB) dá 31 GB. Atualizar o pacote português maxi de 19 GB significa cerca de 50 GB durante a atualização (31 GB retidos mais 19 GB de substituição). (aritmética a partir dos tamanhos de exemplo acima)
- Adicione um pouco de espaço livre para os arquivos próprios do leitor e para cópias. Esta margem não foi testada. (inferido; teste no seu dispositivo)
- Copie os arquivos pela sua rede local quando possível. Baixe uma vez em um link rápido e depois compartilhe. Veja o guia de armazenamento externo nesta pasta para escolhas de disco.

## Atualizando Pacotes

Os dumps da Wikipédia são substituídos segundo um cronograma. A data no nome do arquivo mostra a data do dump. Uma data mais recente significa artigos mais recentes.

- Mantenha o arquivo antigo até que o novo arquivo abra e pesquise corretamente.
- Atualize em um cronograma fixo. Uma ou duas vezes por ano é um plano comum. (inferido)

## Texto da Wikipédia e Modelos de IA Locais

Usar texto da Wikipédia para treinar ou ajustar um modelo de IA local é um tópico diferente. Ele precisa de sua própria verificação. O texto da Wikipédia é publicado sob CC BY-SA. Os [Termos de Uso da Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) dizem que os contribuidores licenciam seu texto sob CC BY-SA 4.0 e que a reutilização deve creditá-los. O texto alterado também deve ser compartilhado sob CC BY-SA. Antes de treinar um modelo, verifique os termos da licença para a saída do modelo, as regras de crédito e se o texto é preciso e justo para a sua comunidade. Procure aconselhamento com alguém que conheça as regras de licença. (inferido; esta nota não é aconselhamento jurídico)

## Questões em Aberto

- Os passos exatos de filtragem do catálogo em library.kiwix.org. (inferido; o site bloqueou o acesso automatizado)
- Se existem pacotes para idiomas asiáticos usados na sua região. Não verificado.
- Se a listagem de downloads oferece arquivos de checksum para verificação de cópias. Não verificado.
- Se o leitor Kiwix funciona bem no seu dispositivo de destino. Não testado.

## Fontes

Obtidas em 2026-10-30.

- https://kiwix.org/en/ (missão do Kiwix, uso offline, opções de leitor e servidor)
- https://lb.download.kiwix.org/zim/wikipedia/ (nomes, datas e tamanhos dos arquivos ZIM da Wikipédia; o endereço de download redireciona para cá)
- https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use (termos de CC BY-SA 4.0 e atribuição para texto de usuários, seção 7)