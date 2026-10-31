---
title: Kiwix Paquetes de idiomas
sourcePath: guides/kiwix-language-packs.md
sourceHash: ea224c1530d1dc6d
translatedBy: glm-4.6
---

# Elección de paquetes de idioma de Kiwix para Wikipedia sin conexión

Kiwix te ofrece copias sin conexión de sitios web, principalmente Wikipedia. El proyecto es una organización sin fines de lucro. Su propio sitio dice que trabaja para hacer [el conocimiento libre accesible donde no hay Internet](https://kiwix.org/en/). Un paquete de contenido de Kiwix es un archivo grande llamado archivo ZIM. Cópialo a un dispositivo y léelo sin internet.

Esta guía te ayuda a elegir un paquete de idioma para un servidor o equipo comunitario. No prueba al lector en tu hardware. Haz pruebas antes de implementarlo.

## Lo que ofrece Kiwix

El sitio de Kiwix enumera una aplicación lectora, un catálogo de contenido y opciones de servidor ([página de inicio de Kiwix](https://kiwix.org/en/)). Consulta las páginas de descarga para las plataformas que necesites.

## Cómo encontrar un paquete de idioma

La biblioteca de Kiwix es el catálogo de archivos ZIM. Su dirección es library.kiwix.org. El sitio de la biblioteca bloqueó el acceso automatizado durante esta investigación, por lo que los pasos a continuación se infieren. Verifícalos en el sitio en vivo.

1. Abre el catálogo y filtra por idioma.
2. Elige la entrada de Wikipedia para ese idioma. Cada idioma tiene su propia edición de Wikipedia.
3. Anota el código de idioma en el nombre del archivo. Ejemplos: pt para portugués, es para español, sw para suajili, qu para quechua, gn para guaraní.

El listado de archivos sin procesar está en [download.kiwix.org](https://lb.download.kiwix.org/zim/wikipedia/). Muestra cada archivo, su fecha y su tamaño.

## Qué significan los nombres de las variantes

Cada idioma de Wikipedia tiene hasta tres variantes en el listado de archivos: nopic, mini y maxi.

Las preguntas frecuentes de Kiwix las definen ([FAQ de Kiwix: qué significan mini, nopic y maxi](https://get.kiwix.org/en/faq-items/what-do-mini-nopic-and-maxi-mean-in-the-wikipedia-zim-files/)):

- **maxi** es la versión completa predeterminada. Contiene artículos completos con imágenes. (las preguntas frecuentes dicen que nopic elimina las imágenes, por lo que maxi las conserva)
- **nopic** contiene artículos completos sin imágenes. Es la opción habitual para uso sin conexión.
- **mini** contiene solo la introducción de cada artículo más la ficha informativa.

## Ejemplos de tamaños

Estos tamaños provienen del listado de archivos en download.kiwix.org. Cada nuevo volcado cambia los tamaños.

| Idioma | Código | Mini | Nopic | Maxi |
|---|---|---|---|---|
| Portugués | pt | 1.6 GB (2026-05) | 6.6 GB (2026-05) | 19 GB (2026-05) |
| Español | es | 3.8 GB (2026-10) | 12 GB (2026-10) | 34 GB (2026-10) |
| Suajili | sw | no listado | 248 MB (2026-10) | 713 MB (2026-10) |
| Quechua | qu | no listado | 57 MB (2026-10) | 229 MB (2026-10) |
| Guaraní | gn | no listado | 14 MB (2026-10) | 64 MB (2026-10) |

El suajili, el quechua y el guaraní no tienen archivo mini en el listado. Los idiomas pequeños tienen paquetes pequeños. El tamaño pequeño también puede significar menos artículos. (inferido; compara el número de artículos en cada edición de Wikipedia)

No revisamos paquetes para idiomas asiáticos. Consulta Preguntas abiertas.

## Planificación del almacenamiento

- Dimensiona el disco para todos los paquetes que planees conservar, más el archivo de reemplazo más grande que descargues junto a ellos durante una actualización. El archivo antiguo permanece hasta que se verifica el nuevo, por lo que ambos existen al mismo tiempo.
- Ejemplo: español nopic (12 GB) más portugués maxi (19 GB) son 31 GB. Actualizar el paquete portugués maxi de 19 GB significa unos 50 GB durante la actualización (31 GB retenidos más un reemplazo de 19 GB). (aritmética a partir de los tamaños de ejemplo anteriores)
- Agrega algo de espacio libre adicional para los archivos propios del lector y para copiar. Este margen no está probado. (inferido; pruébalo en tu dispositivo)
- Copia los archivos a través de tu red local cuando puedas. Descarga una vez en un enlace rápido y luego comparte. Consulta la guía de almacenamiento externo en esta carpeta para elegir discos.

## Actualización de paquetes

Los volcados de Wikipedia se reemplazan según un calendario. La fecha en el nombre del archivo muestra la fecha del volcado. Una fecha más reciente significa artículos más nuevos.

- Conserva el archivo antiguo hasta que el archivo nuevo se abra y busque correctamente.
- Actualiza en un calendario fijo. Una o dos veces al año es un plan común. (inferido)

## Texto de Wikipedia y modelos de IA locales

Usar texto de Wikipedia para entrenar o ajustar un modelo de IA local es un tema diferente. Requiere su propia verificación. El texto de Wikipedia se publica bajo CC BY-SA. Los [Términos de uso de Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) dicen que los colaboradores otorgan la licencia de su texto bajo CC BY-SA 4.0, y que la reutilización debe acreditar a los autores. El texto modificado también debe compartirse bajo CC BY-SA. Antes de entrenar un modelo, revisa los términos de la licencia para la salida del modelo, las reglas de atribución y si el texto es preciso y justo para tu comunidad. Busca asesoramiento de alguien que conozca las reglas de licencias. (inferido; esta nota no es asesoramiento legal)

## Preguntas abiertas

- Los pasos exactos del filtro del catálogo en library.kiwix.org. (inferido; el sitio bloqueó el acceso automatizado)
- Si existen paquetes para idiomas asiáticos usados en tu región. No verificado.
- Si el listado de descargas ofrece archivos de suma de verificación para comprobar copias. No verificado.
- Si el lector de Kiwix funciona bien en tu dispositivo de destino. No probado.

## Fuentes

Consultado el 2026-10-30.

- https://kiwix.org/en/ (misión de Kiwix, uso sin conexión, opciones de lector y servidor)
- https://lb.download.kiwix.org/zim/wikipedia/ (nombres, fechas y tamaños de los archivos ZIM de Wikipedia; la dirección de descarga redirige aquí)
- https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use (CC BY-SA 4.0 y términos de atribución para el texto del usuario, sección 7)