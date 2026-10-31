---
title: Autenticación de dos factores
sourcePath: guides/two-factor-authentication.md
sourceHash: b7712dd0431279f5
translatedBy: glm-4.6
---

# Autenticación de Dos Factores para Administradores de Servidores Comunitarios

La autenticación de dos factores (2FA) solicita una segunda prueba de identidad al iniciar sesión. Una contraseña es el primer factor. Un código de una aplicación de teléfono es un segundo factor común. Esta guía explica por qué las cuentas de administrador en un servidor local deberían usar 2FA. También explica cómo funciona el método común sin conexión, qué plataformas lo admiten y cómo planificar ante la pérdida de dispositivos.

Esta es una guía, no un producto. La comunidad no necesita instalar una herramienta nueva. Necesita un hábito y un plan.

## Por Qué las Cuentas de Administrador la Necesitan

Una cuenta de administrador puede cambiar configuraciones, leer datos y añadir usuarios. En un servidor local que contiene datos críticos de la comunidad, una sola contraseña robada podría exponerlo todo. Un segundo factor hace que una contraseña robada sea mucho menos útil.

Las contraseñas más fuertes también ayudan. La guía de seguridad de YunoHost dice que [las contraseñas débiles son posiblemente la principal razón por la que los servidores son hackeados](https://doc.yunohost.org/en/admin/security/). Recomienda a los miembros usar frases de contraseña largas y un gestor de contraseñas. También aconseja crear cuentas solo para personas de confianza. Use 2FA junto con estos hábitos.

## Cómo Funcionan los Códigos Basados en el Tiempo Sin Conexión

La mayoría de las aplicaciones de 2FA usan TOTP, el método de contraseñas de un solo uso basadas en el tiempo. La IETF lo define en el [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238). La especificación dice:

- El teléfono y el servidor deben compartir una clave secreta.
- Ambos lados deben conocer la hora Unix actual.
- Ambos lados deben usar el mismo intervalo de tiempo.
- TOTP se basa en HOTP (RFC 4226) como fundamento.

El RFC no describe ningún paso de red. El código se genera a partir del secreto compartido y el reloj. Esto sugiere que TOTP funciona sin conexión una vez configurado el secreto (inferido de la especificación; pruébelo en su configuración). El reloj es importante. Si la hora del teléfono se desvía de la hora del servidor, los códigos fallan.

Las aplicaciones de código abierto que admiten TOTP incluyen:

- [Aegis](https://github.com/beemdevelopment/Aegis): descrita como una aplicación Android gratuita, segura y de código abierto para tokens de verificación en dos pasos.
- [FreeOTP+](https://github.com/helloworld1/FreeOTPPlus): listada como una alternativa de código abierto por el proyecto FreeOTP ([repositorio freeotp-android](https://github.com/freeotp/freeotp-android)).

Verifique la versión actual y la licencia de cada aplicación antes de recomendarla.

## Plataformas en Este Repositorio

Verifique la plataforma antes de planificar. El soporte varía mucho.

**Nextcloud** admite 2FA:

- 2FA es opcional por defecto. Los usuarios la activan en su configuración personal. Los administradores pueden [exigirla en todo el sistema o para grupos seleccionados](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html) en Administration Settings → Security.
- Un administrador debe habilitar al menos un proveedor de 2FA antes de que los usuarios puedan usar 2FA ([manual de administrador de Nextcloud](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html)).
- Los usuarios pueden generar códigos de respaldo desde su configuración personal de Second-factor Auth ([manual de usuario de Nextcloud](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html)).

**YunoHost** no muestra 2FA nativa en su guía de seguridad. La guía lista 2FA como un [objetivo a mediano plazo](https://doc.yunohost.org/en/admin/security/), no como una función. Hasta que eso cambie, no asuma que el panel de administración de YunoHost solicita un segundo factor. La misma guía aconseja usar claves SSH en lugar de contraseñas SSH.

Otras plataformas en este repositorio no fueron verificadas para esta guía. Consulte su documentación oficial antes de planificar 2FA para ellas.

## Códigos de Respaldo y Recuperación

Planifique ante un teléfono perdido o robado antes de que suceda.

- **Genere códigos de respaldo** cuando active 2FA. El manual de usuario de Nextcloud dice [generarlos y almacenarlos de forma segura](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html).
- **Guarde los códigos de respaldo aparte del teléfono.** El mismo manual dice no mantenerlos junto con el dispositivo de segundo factor, de modo que perder uno no signifique perder ambos.
- **Anote la ruta de recuperación.** ¿Quién puede restablecer una cuenta? ¿Dónde se guardan los códigos de respaldo? ¿Quién tiene la contraseña del servidor?
- **Pruebe la recuperación** una vez, en una cuenta no crítica, antes de necesitarla.

## Cuentas de Administrador Compartidas

Los inicios de sesión compartidos dificultan saber quién cambió qué. También dificultan la gestión de 2FA, porque un solo teléfono puede contener el código para todos.

Prefiera una cuenta de administrador con nombre para cada persona de confianza. Si una comunidad debe compartir un inicio de sesión de administrador, registre quién posee el segundo factor y guarde los códigos de respaldo en un lugar bajo llave. Revise la lista de administradores con frecuencia. El consejo de la guía de YunoHost de crear cuentas solo para personas de confianza aplica aquí.

## Preguntas Abiertas

- (inferido) El proveedor TOTP de Nextcloud funciona con aplicaciones compatibles con RFC 6238 como Aegis. La página oficial de administración fue consultada, pero la línea exacta no fue confirmada en el texto obtenido.
- (inferido) La aplicación "Two-Factor Admin Support" de Nextcloud puede emitir un código de inicio de sesión de un solo uso cuando un usuario pierde tanto el segundo factor como los códigos de respaldo. Un manual más antiguo la menciona. Verifique la documentación actual de Nextcloud antes de confiar en ella.
- No se ha probado si TOTP funciona completamente sin conexión en un teléfono y servidor determinados.
- El estado de 2FA en YunoHost puede cambiar. Consulte las notas de la versión actual de YunoHost.

## Fuentes

Consultadas el 2026-10-30.

- https://www.rfc-editor.org/rfc/rfc6238 (requisitos TOTP R1-R3)
- https://github.com/beemdevelopment/Aegis (descripción de Aegis)
- https://github.com/freeotp/freeotp-android (alternativas listadas, incluyendo FreeOTP+)
- https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html (2FA opcional por defecto, exigencia, requisito de proveedor)
- https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html (códigos de respaldo, consejo de almacenamiento)
- https://doc.yunohost.org/en/admin/security/ (consejo de contraseñas, claves SSH, 2FA como objetivo a mediano plazo)