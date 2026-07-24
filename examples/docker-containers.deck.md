---
title: Docker & Containers
description: Imagens, containers, volumes, redes e Docker Compose
tags:
  - docker
  - devops
  - containers
version: 1
---

# Conceitos base

Uma {{c1::imagem}} Docker é um template imutável em camadas. Um {{c2::container}} é uma instância em execução de uma imagem — efêmero e isolado.

As camadas de uma imagem são {{c1::somente leitura}}. Ao criar um container, o Docker adiciona uma camada {{c2::gravável}} no topo.

O {{c1::Docker Hub}} é o registry público padrão. Imagens privadas podem ser hospedadas em registries como {{c2::ECR}} (AWS) ou {{c3::GCR}} (Google Cloud).

# Dockerfile

A instrução {{c1::FROM}} define a imagem base. É sempre a primeira instrução não-comentada.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

`RUN` executa durante o {{c1::build}} e cria uma nova camada. `CMD` define o comando padrão executado ao {{c2::iniciar}} o container.

A diferença entre `CMD` e `ENTRYPOINT`: `{{c1::ENTRYPOINT}}` define o executável fixo, enquanto `CMD` fornece {{c2::argumentos padrão}} que podem ser sobrescritos.

Usar `COPY package*.json ./` antes de `COPY . .` aproveita o {{c1::cache}} de camadas — a instalação de dependências só é reexecutada quando o `package.json` muda.

# Comandos essenciais

| Comando | O que faz |
|---------|-----------|
| `docker build -t nome .` | Constrói imagem com {{c1::tag}} |
| `docker run -d -p 8080:80 nome` | Executa em background mapeando {{c2::porta}} |
| `docker ps` | Lista containers {{c3::em execução}} |
| `docker exec -it id sh` | Abre shell {{c4::interativo}} |
| `docker logs -f id` | Segue os logs em {{c5::tempo real}} |

`docker run --rm` remove o container automaticamente após {{c1::encerrar}}.

# Volumes e persistência

Dados dentro do container são {{c1::perdidos}} ao removê-lo. Para persistir, use volumes.

`docker volume create nome` cria um {{c1::volume gerenciado}} pelo Docker (armazenado em `/var/lib/docker/volumes`).

`-v $(pwd):/app` é um {{c1::bind mount}} — mapeia um diretório do host diretamente para o container, útil para desenvolvimento.

# Redes

Por padrão, containers na mesma rede `{{c1::bridge}}` se comunicam pelo nome do container como hostname.

`docker network create nome` cria uma rede isolada. Containers em redes diferentes são {{c1::isolados}} entre si sem regras explícitas.

# Docker Compose

O `docker-compose.yml` descreve a stack completa: serviços, volumes, redes e variáveis de ambiente.

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

`docker compose up -d` inicia todos os serviços em {{c1::background}}. `docker compose down -v` para e remove containers **e** {{c2::volumes}}.

`depends_on` garante a {{c1::ordem de inicialização}}, mas não espera o serviço estar {{c2::saudável}} — para isso, use `healthcheck`.
