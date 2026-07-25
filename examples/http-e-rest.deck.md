---
title: HTTP & REST
description: Protocolo HTTP, status codes, métodos e design de APIs REST
tags:
  - http
  - rest
  - api
  - backend
version: 1
---

# Métodos HTTP

| Método | Uso semântico | Idempotente? |
|--------|--------------|--------------|
| GET | Leitura de recurso | ✅ sim |
| POST | Criação de recurso | ❌ não |
| PUT | Substituição completa | ✅ sim |
| PATCH | Atualização parcial | ❌ geralmente não |
| DELETE | Remoção de recurso | ✅ sim |

Um método é {{c1::idempotente}} quando chamadas repetidas produzem o mesmo resultado que uma única chamada.

`GET` e `HEAD` são também {{c1::seguros}} — não devem modificar estado no servidor.

# Status Codes

`2xx` indica {{c1::sucesso}}. `4xx` indica erro do {{c2::cliente}}. `5xx` indica erro do {{c3::servidor}}.

| Code | Significado |
|------|-------------|
| 200 | {{c1::OK}} — requisição bem-sucedida |
| 201 | {{c2::Created}} — recurso criado (retornar Location header) |
| 204 | {{c3::No Content}} — sucesso sem corpo de resposta |
| 400 | {{c4::Bad Request}} — payload inválido |
| 401 | {{c5::Unauthorized}} — não autenticado |
| 403 | {{c6::Forbidden}} — autenticado mas sem permissão |
| 404 | {{c7::Not Found}} — recurso não existe |
| 409 | {{c8::Conflict}} — conflito de estado (ex: duplicata) |
| 422 | {{c9::Unprocessable Entity}} — validação falhou |
| 429 | {{c10::Too Many Requests}} — rate limit atingido |
| 500 | {{c11::Internal Server Error}} — erro inesperado |
| 503 | {{c12::Service Unavailable}} — serviço indisponível |

A diferença entre `401` e `403`: `401` significa que o cliente {{c1::não está autenticado}}; `403` significa que está autenticado mas {{c2::não tem permissão}}.

# Headers importantes

`Content-Type` informa o {{c1::formato do corpo}} enviado. `Accept` diz ao servidor quais formatos o cliente {{c2::aceita}} como resposta.

`Authorization: Bearer <token>` é o padrão para autenticação com {{c1::JWT}} ou tokens OAuth.

`Cache-Control: max-age=3600` instrui caches a manter o recurso por {{c1::3600 segundos}}.

`ETag` é um identificador de versão de recurso usado para {{c1::cache condicional}} — o cliente reenvia com `If-None-Match` e o servidor responde `304` se não mudou.

# Design REST

Em REST, cada URL identifica um {{c1::recurso}}. Recursos são substantivos, não verbos: `/users`, não `/getUsers`.

Coleções usam plural: `/products`. Recursos individuais: `/products/{{c1::42}}`. Recursos aninhados: `/users/5/{{c2::orders}}`.

A resposta de `POST /recursos` deve incluir o header `{{c1::Location}}` com a URL do recurso criado e retornar status `{{c2::201}}`.

# CORS

CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança do browser que bloqueia requisições a origens diferentes da origem da página.

O header `{{c1::Access-Control-Allow-Origin}}` indica quais origens podem acessar o recurso.

Requisições com métodos não-simples (PUT, DELETE, PATCH) ou headers customizados disparam uma requisição {{c1::preflight}} com método `{{c2::OPTIONS}}` antes da requisição real.

# Autenticação vs Autorização

{{c1::Autenticação}} responde "quem é você?". {{c2::Autorização}} responde "o que você pode fazer?".

JWT (JSON Web Token) é composto por três partes separadas por `.`: `{{c1::header}}`.`{{c2::payload}}`.`{{c3::signature}}`.

A {{c1::signature}} do JWT garante que o conteúdo não foi adulterado — mas o payload é apenas {{c2::Base64}}, não criptografado.

```steps
title: Autenticar com JWT em uma API REST

1. Enviar credenciais via POST /auth/login com email e senha
2. Receber o JWT no corpo da resposta
3. Armazenar o token de forma segura (httpOnly cookie ou memória)
4. Incluir o token em cada requisição: Authorization: Bearer <token>
5. Verificar a expiração do token (campo exp no payload)
6. Renovar o token com o refresh token antes de expirar
```
