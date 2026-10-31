---
title: Paquetes de idioma de Kiwix
sourcePath: guides/kiwix-language-packs.md
sourceHash: 954e4018e548143a
translatedBy: glm-4.6
---

# Cómo elegir paquetes de idioma de Kiwix para Wikipedia sin conexión

Kiwix te ofrece copias sin conexión de sitios web, principalmente Wikipedia. El proyecto es sin fines de lucro. Su propio sitio dice que trabaja para hacer que [el conocimiento libre sea accesible donde no hay Internet](https://kiwix.org/en/). Un paquete de contenido de Kiwix es un archivo grande llamado archivo ZIM. Cópialo a un dispositivo y lélolo sin internet.

Esta guía te ayuda a elegir un paquete de idioma para un servidor comunitario o una caja. No prueba el lector en tu hardware. Haz pruebas antes de implementarlo.

## Lo que ofrece Kiwix

El sitio de Kiwix enumera una aplicación lectora, un catálogo de contenido y opciones de servidor ([página principal de Kiwix](https://kiwix.org/en/)). Consulta las páginas de descarga para las plataformas que necesites.

## Cómo encontrar un paquete de idioma

La biblioteca de Kiwix es el catálogo de archivos ZIM. Su dirección es library.kiwix.org. El sitio de la biblioteca bloqueó el acceso automatizado durante esta investigación, por lo que los pasos a continuación se infieren. Verifícalos en el sitio en vivo.

1. Abre el catálogo y filtra por idioma.
2. Elige la entrada de Wikipedia para ese idioma. Cada idioma tiene su propia edición de Wikipedia.
3. Observa el código de idioma en el nombre del archivo. Ejemplos: pt para portugués, es para español, sw para suajili, qu para quechua, gn para guaraní.

El listado de archivos en bruto está en [download.kiwix.org](https://lb.download.kiwix.org/zim/wikipedia/). Muestra cada archivo, su fecha y su tamaño.

## Qué significan los nombres de las variantes

Cada idioma de Wikipedia tiene hasta tres variantes en el listado de archivos: nopic, mini y maxi.

- **nopic** conserva los artículos y elimina la mayoría de las imágenes. Es la opción habitual para uso sin conexión.
- **mini** parece contener solo las introducciones de los artículos. (inferido de los tamaños de los archivos)
- **maxi** es la más grande. Contiene la mayor cantidad de contenido e imágenes.

No pudimos confirmar estos significados en una página de Kiwix. Trata las descripciones anteriores como inferidas hasta que consultes la documentación de Kiwix.

## Tamaños de ejemplo

Estos tamaños provienen del listado de archivos en download.kiwix.org. Cada nueva descarga cambia los tamaños.

| Idioma | Código | Mini | Nopic | Maxi |
|---|---|---|---|---|
| Portugués | pt | 1.6 GB (2026-05) | 6.6 GB (2026-05) | 19 GB (2026-05) |
| Español | es | 3.8 GB (2026-10) | 12 GB (2026-10) | 34 GB (2026-10) |
| Suajili | sw | no listado | 248 MB (2026-10) | 713 MB (2026-10) |
| Quechua | qu | no listado | 57 MB (2026-10) | 229 MB (2026-10) |
| Guaraní | gn | no listado | 14 MB (2026-10) | 64 MB (2026-10) |

El suajili, el quechua y el guaraní no tienen un archivo mini en el listado. Los idiomas pequeños tienen paquetes pequeños. El tamaño pequeño también puede significar menos artículos. (inferido; compara los recuentos de artículos en cada edición de Wikipedia)

No verificamos paquetes para idiomas asiáticos. Consulta Preguntas abiertas.

## Planificación del almacenamiento

- Comienza con el tamaño del archivo y luego añade espacio libre para el lector y para copiar. Planifica alrededor de un 20 por ciento adicional. (inferido; pruébalo en tu dispositivo)
- Dimensiona el disco para todos los paquetes que planees conservar. Ejemplo: español nopic más portugués maxi es de unos 31 GB antes del espacio adicional.
- Copia los archivos por tu red local cuando puedas. Descarga una vez en un enlace rápido y luego comparte. Consulta la guía de almacenamiento externo en esta carpeta para elegir discos.

## Actualización de paquetes

Las descargas de Wikipedia se reemplazan según un calendario. La fecha en el nombre del archivo muestra la fecha de la descarga. Una fecha más reciente significa artículos más nuevos.

- Conserva el archivo antiguo hasta que el archivo nuevo se abra y busque correctamente.
- Actualiza según un calendario fijo. Una o dos veces al año es un plan común. (inferido)

## Texto de Wikipedia y modelos de IA locales

Usar el texto de Wikipedia para entrenar o ajustar un modelo de IA local es un tema diferente. Requiere su propia verificación. El texto de Wikipedia se publica bajo CC BY-SA. Los [Términos de uso de Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) dicen que los colaboradores licencian su texto bajo CC BY-SA 4.0, y que la reutilización debe acreditar a los autores. El texto modificado también debe compartirse bajo CC BY-SA. Antes de entrenar un modelo, revisa los términos de la licencia para la salida del modelo, las reglas de atribución y si el texto es preciso y justo para tu comunidad. Busca el consejo de alguien que conozca las reglas de licencias. (inferido; esta nota no es asesoría legal)

## Preguntas abiertas

- Los pasos exactos para filtrar el catálogo en library.kiwix.org. (inferido; el sitio bloqueó el acceso automatizado)
- El significado de nopic, mini y maxi en una página oficial de Kiwix. (inferido)
- Si existen paquetes para los idiomas asiáticos usados en tu región. No verificado.
- Si el listado de descargas ofrece archivos de suma de verificación para comprobar las copias. No verificado.
- Si el lector de Kiwix funciona bien en tu dispositivo de destino. No probado.

## Fuentes

Consultado el 2026-10-30.

- https://kiwix.org/en/ (misión de Kiwix, uso sin conexión, opciones de lector y servidor)
- https://lb.download.kiwix.org/zim/wikipedia/ (nombres, fechas y tamaños de los archivos ZIM de Wikipedia; la dirección de descarga redirige aquí)
- https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use (términos de CC BY-SA 4.0 y de atribución para el texto de usuarios, sección 7)