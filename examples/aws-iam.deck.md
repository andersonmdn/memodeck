---
title: AWS IAM
description: Identidade, acesso e políticas na AWS
tags:
  - aws
  - security
  - cloud
version: 1
---

# Conceitos fundamentais

O {{c1::IAM}} (Identity and Access Management) é o serviço da AWS que controla **quem** pode fazer **o quê** nos recursos da conta.

No IAM, um {{c1::usuário}} representa uma pessoa ou aplicação, um {{c2::grupo}} é uma coleção de usuários, e uma {{c3::role}} é uma identidade assumível por serviços ou usuários externos.

# Políticas

As {{c1::policies}} são documentos JSON que definem permissões. Elas são **anexadas** a usuários, grupos ou roles.

Uma policy de {{c1::Allow}} explicitamente autoriza a ação, enquanto {{c2::Deny}} a bloqueia — e um Deny **sempre** prevalece sobre um Allow.

A política gerenciada {{c1::AdministratorAccess}} concede acesso total a todos os serviços. Já a {{c2::ReadOnlyAccess}} permite apenas leitura.

# Autenticação e acesso programático

Para acesso via CLI ou SDK, é necessário criar {{c1::Access Keys}} compostas de um **Access Key ID** e um **Secret Access Key**.

O serviço {{c1::STS}} (Security Token Service) emite credenciais temporárias ao assumir uma role — essas credenciais expiram automaticamente.

# Auditoria

O {{c1::CloudTrail}} registra todas as chamadas de API feitas na conta AWS, incluindo quem fez, quando, de qual IP e qual resposta recebeu.

O {{c1::IAM Access Analyzer}} identifica recursos compartilhados com {{c2::entidades externas}} à organização, ajudando a detectar acessos não intencionais.

# Boas práticas

O princípio do {{c1::menor privilégio}} determina que cada identidade deve ter apenas as permissões estritamente necessárias para sua função.

Habilitar o {{c1::MFA}} (Multi-Factor Authentication) para o usuário root e para usuários com acesso privilegiado é uma prática essencial de segurança.

```steps
title: Criar usuário IAM com acesso mínimo

1. Acessar o console IAM e criar um novo usuário sem acesso ao console
2. Criar um grupo com policy restrita ao serviço necessário
3. Adicionar o usuário ao grupo
4. Gerar Access Keys apenas se acesso programático for obrigatório
5. Habilitar MFA para o usuário
6. Validar as permissões com o IAM Policy Simulator
```
