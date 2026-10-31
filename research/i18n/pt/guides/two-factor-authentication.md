---
title: Autenticação de Dois Fatores
sourcePath: guides/two-factor-authentication.md
sourceHash: b7712dd0431279f5
translatedBy: glm-4.6
---

# Autenticação de Dois Fatores para Administradores de Servidores Comunitários

A autenticação de dois fatores (2FA) pede uma segunda prova de identidade no login. Uma senha é o primeiro fator. Um código de um aplicativo de celular é um segundo fator comum. Este guia explica por que contas de administrador em um servidor local devem usar 2FA. Também explica como o método comum funciona offline, quais plataformas o suportam e como planejar para o caso de dispositivos perdidos.

Este é um guia, não um produto. A comunidade não precisa instalar uma nova ferramenta. Ela precisa de um hábito e de um plano.

## Por Que Contas de Administrador Precisam Disso

Uma conta de administrador pode alterar configurações, ler dados e adicionar usuários. Em um servidor local que guarda dados críticos da comunidade, uma senha roubada poderia expor tudo. Um segundo fator torna uma senha roubada muito menos útil.

Senhas mais fortes também ajudam. O guia de segurança do YunoHost diz que [senhas fracas são possivelmente a principal razão pela qual servidores são hackeados](https://doc.yunohost.org/en/admin/security/). Ele aconselha os membros a usarem frases-senha longas e um gerenciador de senhas. Também aconselha criar contas apenas para pessoas em quem você confia. Use 2FA junto com esses hábitos.

## Como Códigos Baseados em Tempo Funcionam Offline

A maioria dos aplicativos de 2FA usa TOTP, o método de senha de uso único baseado em tempo. A IETF o define no [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238). A especificação diz:

- O celular e o servidor devem compartilhar uma chave secreta.
- Ambos os lados devem conhecer a hora Unix atual.
- Ambos os lados devem usar o mesmo passo de tempo.
- O TOTP é construído sobre o HOTP (RFC 4226) como base.

O RFC não descreve nenhuma etapa de rede. O código é gerado a partir do segredo compartilhado e do relógio. Isso sugere que o TOTP funciona offline depois que o segredo é configurado (inferido da especificação; teste na sua configuração). O relógio importa. Se a hora do celular se desviar da hora do servidor, os códigos falham.

Aplicativos de código aberto que fazem TOTP incluem:

- [Aegis](https://github.com/beemdevelopment/Aegis): descrito como um aplicativo Android gratuito, seguro e de código aberto para tokens de verificação em duas etapas.
- [FreeOTP+](https://github.com/helloworld1/FreeOTPPlus): listado como uma alternativa de código aberto pelo projeto FreeOTP ([repositório freeotp-android](https://github.com/freeotp/freeotp-android)).

Verifique a versão atual e a licença de cada aplicativo antes de recomendá-lo.

## Plataformas Neste Repositório

Verifique a plataforma antes de planejar. O suporte varia muito.

O **Nextcloud** suporta 2FA:

- A 2FA é opcional por padrão. Os usuários a ativam nas suas configurações pessoais. Administradores podem [exigi-la em todo o sistema ou para grupos selecionados](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html) em Administration Settings → Security (Configurações de Administração → Segurança).
- Um administrador deve ativar pelo menos um provedor de 2FA antes que os usuários possam usar 2FA ([manual de administração do Nextcloud](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html)).
- Os usuários podem gerar códigos de backup nas suas configurações pessoais de Second-factor Auth ([manual do usuário do Nextcloud](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html)).

O **YunoHost** não mostra 2FA nativa em seu guia de segurança. O guia lista a 2FA como uma [meta de médio prazo](https://doc.yunohost.org/en/admin/security/), não como um recurso. Até que isso mude, não presuma que o painel de administração do YunoHost pede um segundo fator. O mesmo guia aconselha chaves SSH no lugar de senhas SSH.

Outras plataformas neste repositório não foram verificadas para este guia. Consulte a documentação oficial delas antes de planejar a 2FA para elas.

## Códigos de Backup e Recuperação

Planeje para um celular perdido ou roubado antes que aconteça.

- **Gere códigos de backup** ao ativar a 2FA. O manual do usuário do Nextcloud diz para [gerá-los e armazená-los com segurança](https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html).
- **Armazene os códigos de backup separadamente do celular.** O mesmo manual diz para não mantê-los junto ao dispositivo de segundo fator, para que perder um não signifique perder ambos.
- **Anote o caminho de recuperação.** Quem pode redefinir uma conta? Onde os códigos de backup são guardados? Quem tem a senha do servidor?
- **Teste a recuperação** uma vez, em uma conta não crítica, antes de precisar dela.

## Contas de Administrador Compartilhadas

Logins compartilhados tornam difícil saber quem mudou o quê. Eles também tornam a 2FA mais difícil de gerenciar, porque um celular pode conter o código para todos.

Prefira uma conta de administrador nomeada por pessoa de confiança. Se uma comunidade precisar compartilhar um login de administrador, registre quem tem o segundo fator e mantenha os códigos de backup em um local trancado. Revise a lista de administradores com frequência. O conselho do guia do YunoHost de criar contas apenas para pessoas de confiança se aplica aqui.

## Questões em Aberto

- (inferido) O provedor TOTP do Nextcloud funciona com aplicativos compatíveis com RFC 6238, como o Aegis. A página oficial de administração foi obtida, mas a linha exata não foi confirmada no texto obtido.
- (inferido) O aplicativo "Two-Factor Admin Support" do Nextcloud pode emitir um código de login de uso único quando um usuário perde tanto o segundo fator quanto os códigos de backup. Um manual mais antigo o menciona. Consulte a documentação atual do Nextcloud antes de depender dele.
- Se o TOTP funciona totalmente offline em um determinado celular e servidor não foi testado.
- O status da 2FA no YunoHost pode mudar. Consulte as notas de versão atuais do YunoHost.

## Fontes

Obtidas em 2026-10-30.

- https://www.rfc-editor.org/rfc/rfc6238 (requisitos do TOTP R1-R3)
- https://github.com/beemdevelopment/Aegis (descrição do Aegis)
- https://github.com/freeotp/freeotp-android (alternativas listadas, incluindo FreeOTP+)
- https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html (2FA opcional por padrão, exigência, requisito de provedor)
- https://docs.nextcloud.com/server/stable/user_manual/en/user_2fa.html (códigos de backup, conselho de armazenamento)
- https://doc.yunohost.org/en/admin/security/ (conselho sobre senhas, chaves SSH, 2FA como meta de médio prazo)