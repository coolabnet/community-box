---
title: Kiwix Pacotes de Idiomas
sourcePath: guides/kiwix-language-packs.md
sourceHash: 954e4018e548143a
translatedBy: glm-4.6
---

# Escolhendo Pacotes de Idiomas do Kiwix para Wikipédia Offline

O Kiwix fornece cópias offline de sites, principalmente a Wikipédia. O projeto é sem fins lucrativos. Seu próprio site diz que trabalha para tornar [o conhecimento livre acessível onde a Internet não está](https://kiwix.org/en/). Um pacote de conteúdo do Kiwix é um arquivo grande chamado arquivo ZIM. Copie-o para um dispositivo e leia-o sem internet.

Este guia ajuda você a escolher um pacote de idiomas para um servidor ou caixa comunitária. Ele não testa o leitor no seu hardware. Teste antes de implantar.

## O que o Kiwix Oferece

O site do Kiwix lista um aplicativo leitor, um catálogo de conteúdo e opções de servidor ([página inicial do Kiwix](https://kiwix.org/en/)). Verifique as páginas de download das plataformas de que você precisa.

## Encontrando um Pacote de Idiomas

A biblioteca do Kiwix é o catálogo de arquivos ZIM. Seu endereço é library.kiwix.org. O site da biblioteca bloqueou o acesso automatizado durante esta pesquisa, então as etapas abaixo são inferidas. Verifique-as no site ao vivo.

1. Abra o catálogo e filtre por idioma.
2. Escolha a entrada da Wikipédia para esse idioma. Cada idioma tem sua própria edição da Wikipédia.
3. Anote o código do idioma no nome do arquivo. Exemplos: pt para português, es para espanhol, sw para suaíli, qu para quéchua, gn para guarani.

A listagem bruta de arquivos está em [download.kiwix.org](https://lb.download.kiwix.org/zim/wikipedia/). Ela mostra cada arquivo, sua data e seu tamanho.

## O que Significam os Nomes das Variantes

Cada idioma da Wikipédia tem até três variantes na listagem de arquivos: nopic, mini e maxi.

- **nopic** mantém os artigos e descarta a maioria das imagens. É a escolha usual para uso offline.
- **mini** parece conter apenas as introduções dos artigos. (inferido dos tamanhos dos arquivos)
- **maxi** é o maior. Contém a maior quantidade de conteúdo e imagens.

Não conseguimos confirmar esses significados em uma página do Kiwix. Trate as descrições acima como inferidas até você verificar a documentação do Kiwix.

## Tamanhos de Exemplo

Esses tamanhos vêm da listagem de arquivos em download.kiwix.org. Cada novo dump altera os tamanhos.

| Idioma | Código | Mini | Nopic | Maxi |
|---|---|---|---|---|
| Português | pt | 1.6 GB (2026-05) | 6.6 GB (2026-05) | 19 GB (2026-05) |
| Espanhol | es | 3.8 GB (2026-10) | 12 GB (2026-10) | 34 GB (2026-10) |
| Suaíli | sw | não listado | 248 MB (2026-10) | 713 MB (2026-10) |
| Quéchua | qu | não listado | 57 MB (2026-10) | 229 MB (2026-10) |
| Guarani | gn | não listado | 14 MB (2026-10) | 64 MB (2026-10) |

Suaíli, quéchua e guarani não têm arquivo mini na listagem. Idiomas pequenos têm pacotes pequenos. O tamanho pequeno também pode significar menos artigos. (inferido; compare a contagem de artigos em cada edição da Wikipédia)

Não verificamos pacotes para idiomas asiáticos. Veja Questões Abertas.

## Planejando o Armazenamento

- Comece pelo tamanho do arquivo e depois adicione espaço livre para o leitor e para a cópia. Planeje cerca de 20 por cento extras. (inferido; teste no seu dispositivo)
- Dimensione o disco para todos os pacotes que planeja manter. Exemplo: nopic em espanhol mais maxi em português são cerca de 31 GB antes do espaço extra.
- Copie arquivos pela sua rede local quando puder. Baixe uma vez em um link rápido e depois compartilhe. Veja o guia de armazenamento externo nesta pasta para escolhas de disco.

## Atualizando Pacotes

Os dumps da Wikipédia são substituídos em um cronograma. A data no nome do arquivo mostra a data do dump. Uma data mais recente significa artigos mais recentes.

- Mantenha o arquivo antigo até que o novo arquivo abra e pesquise corretamente.
- Atualize em um cronograma fixo. Uma ou duas vezes por ano é um plano comum. (inferido)

## Texto da Wikipédia e Modelos de IA Locais

Usar texto da Wikipédia para treinar ou ajustar um modelo de IA local é um assunto diferente. Ele requer sua própria verificação. O texto da Wikipédia é distribuído sob CC BY-SA. Os [Termos de Uso da Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) dizem que os colaboradores licenciam seu texto sob CC BY-SA 4.0, e que a reutilização deve creditar os autores. O texto modificado também deve ser compartilhado sob CC BY-SA. Antes de treinar um modelo, verifique os termos da licença para a saída do modelo, as regras de crédito e se o texto é preciso e justo para sua comunidade. Busque orientação de alguém que conheça as regras de licenciamento. (inferido; esta nota não é aconselhamento jurídico)

## Questões Abertas

- As etapas exatas do filtro do catálogo em library.kiwix.org. (inferido; o site bloqueou o acesso automatizado)
- O significado de nopic, mini e maxi em uma página oficial do Kiwix. (inferido)
- Se existem pacotes para idiomas asiáticos usados em sua região. Não verificado.
- Se a listagem de download oferece arquivos de checksum para verificar cópias. Não verificado.
- Se o leitor do Kiwix funciona bem no seu dispositivo alvo. Não testado.

## Fontes

Acessados em 2026-10-30.

- https://kiwix.org/en/ (missão do Kiwix, uso offline, opções de leitor e servidor)
- https://lb.download.kiwix.org/zim/wikipedia/ (nomes, datas e tamanhos dos arquivos ZIM da Wikipédia; o endereço de download redireciona para cá)
- https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use (CC BY-SA 4.0 e termos de atribuição para texto de usuários, seção 7)