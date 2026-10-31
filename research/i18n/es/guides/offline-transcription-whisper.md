---
title: Transcripción sin conexión con Whisper
sourcePath: guides/offline-transcription-whisper.md
sourceHash: 31f81f379a28b51e
translatedBy: glm-4.6
---

# Nota de factibilidad de Voz a Texto sin conexión con Whisper

> **Nota de factibilidad.** Esta nota evalúa si la transcripción sin conexión es posible en hardware comunitario. No recomienda una configuración. La decisión sobre el alcance (Q17) sigue pendiente.

La conversión de voz a texto transforma audio hablado en texto escrito. Algunas comunidades quieren registrar reuniones locales, entrevistas o notas de voz. Esta nota pregunta si eso puede funcionar sin conexión, en hardware que una red comunitaria pueda costear.

## Qué es Whisper

Whisper es un modelo de reconocimiento de voz de OpenAI. Su código y pesos del modelo se publican bajo la Licencia MIT ([openai/whisper](https://github.com/openai/whisper)). La Licencia MIT permite su uso gratuito, incluido el uso comercial, conservando una copia de la licencia.

whisper.cpp es un port de Whisper en C y C++. No tiene dependencias y funciona en la CPU. Su licencia también es MIT ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)). Su lista de plataformas incluye Linux, Windows, macOS, Android, iOS, WebAssembly y Docker. Menciona Raspberry Pi como plataforma, con un enlace a una discusión.

Ambos proyectos ejecutan la inferencia en tu propio dispositivo. La demo de whisper.cpp para iPhone se describe como totalmente sin conexión y en el dispositivo ([whisper.cpp README](https://github.com/ggml-org/whisper.cpp)). Prueba la afirmación de funcionamiento sin conexión en tu propia configuración antes de confiar en ella.

## Tamaños de modelo y memoria

Whisper viene en cinco tamaños: tiny, base, small, medium y large. El README de OpenAI enumera estas cifras ([openai/whisper](https://github.com/openai/whisper)):

| Modelo | Parámetros | VRAM requerida (GPU) | Velocidad relativa |
|---|---|---|---|
| tiny | 39 M | unos 1 GB | unas 10x |
| base | 74 M | unos 1 GB | unas 7x |
| small | 244 M | unos 2 GB | unas 4x |
| medium | 769 M | unos 5 GB | unas 2x |
| large | 1550 M | unos 10 GB | 1x |

El README midió la velocidad relativa transcribiendo habla en inglés en una GPU A100. Esas cifras no aplican a una placa pequeña con CPU.

El README de whisper.cpp da cifras de disco y memoria para uso en CPU ([ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp)):

| Modelo | Disco | Memoria |
|---|---|---|
| tiny | 75 MiB | unos 273 MB |
| base | 142 MiB | unos 388 MB |
| small | 466 MiB | unos 852 MB |
| medium | 1.5 GiB | unos 2.1 GB |
| large | 2.9 GiB | unos 3.9 GB |

La necesidad de memoria crece con el tamaño del modelo. Un dispositivo con 2 GB de RAM puede ejecutar tiny o base. Los modelos más grandes necesitan más RAM para funcionar en absoluto.

## Niveles de hardware

Encontramos solo un benchmark citado en una placa pequeña. Es una página de resultados de whisper.cpp, con tiempos en milisegundos ([whisper.cpp issue 89](https://github.com/ggml-org/whisper.cpp/issues/89)). La página no indica la duración del clip de audio. La herramienta bench de whisper.cpp mide solo el codificador, sobre datos aleatorios, no una transcripción completa de audio real ([bench README](https://github.com/ggml-org/whisper.cpp/blob/master/examples/bench/README.md)). Trata todos los tiempos siguientes solo como relativos, y no los leas como tiempo de transcripción completa.

- **Raspberry Pi 5:** no se encontró benchmark para esta placa. La única fila de una Pi es una Raspberry Pi 4. Su tiempo de codificación fue de unos 13.8 segundos para tiny y unos 30.6 segundos para base. (inferido para la Pi 5: espera resultados al menos tan buenos como los de la Pi 4, pero pruébalo)
- **ZimaBoard y series Intel N:** no se encontró benchmark para estas placas. La página no tiene filas de la serie N. Prueba antes de planificar con ellas.
- **NUC u otras cajas x86 con más RAM:** la misma página enumera filas de x86. Un Ryzen 9 5950X ejecutó tiny en unos 197 ms y large en unos 8.1 segundos. Más RAM te permite ejecutar los modelos medium o large. La velocidad sigue dependiendo de la CPU.

Niveles prácticos, basados en las cifras anteriores:

1. **Placa pequeña, 2 GB de RAM:** solo tiny o base. Espera resultados lentos. (inferido)
2. **Placa con 4 GB o más de RAM:** small podría caber. Mide la velocidad real. (inferido)
3. **Mini PC x86 con más RAM:** medium podría ser viable. Mide primero. (inferido)

## Cobertura de idiomas

El README dice que los modelos multilingües (tiny, base, small, medium, large) pueden manejar habla que no sea en inglés. Las versiones solo en inglés (que terminan en .en) funcionan mejor para inglés, especialmente tiny.en y base.en ([openai/whisper](https://github.com/openai/whisper)). El modelo turbo no está entrenado para traducción, así que usa un modelo multilingüe si necesitas traducción.

No verificamos qué idiomas Whisper soporta bien. Los idiomas indígenas y locales suelen tener pocos datos de entrenamiento. La precisión puede ser baja para ellos. (inferido) Prueba con hablantes nativos antes de confiar en cualquier transcripción.

## Beneficio de privacidad

Ejecutar el modelo en tu propio dispositivo mantiene el audio en tu dispositivo. Nada necesita salir de la red local. Esta es la razón principal para ejecutarlo sin conexión. (inferido del diseño de la inferencia local)

Revisa otros riesgos. Las transcripciones aún pueden revelar datos sensibles. Guárdalas bajo las mismas reglas que otros registros comunitarios.

## Preguntas abiertas

- Velocidad real en Raspberry Pi 5 con los modelos tiny, base y small. No encontrado.
- Duración del clip detrás de la tabla de tiempos de whisper.cpp. No se indica.
- Precisión para idiomas indígenas o locales específicos. No probado.
- Si la decisión sobre el alcance (Q17) pide transcripción en vivo o transcripción de archivos. Pendiente.
- Consumo de energía y calor en placas pequeñas durante trabajos largos. No verificado.

## Fuentes

Consultadas el 2026-10-30.

- https://github.com/openai/whisper (licencia MIT, tamaños de modelo y tabla de VRAM, notas sobre multilingüe y .en, nota sobre traducción de turbo)
- https://github.com/ggml-org/whisper.cpp (licencia MIT, port en C/C++, solo CPU, lista de plataformas, demo descrita como totalmente sin conexión, tabla de memoria en CPU)
- https://github.com/ggml-org/whisper.cpp/issues/89 (tabla de benchmark con filas de Raspberry Pi 4 y x86, tiempos en ms)