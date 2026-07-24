---
title: SQL Fundamentos
description: Consultas, joins, índices, transações e otimização
tags:
  - sql
  - database
  - backend
version: 1
---

# SELECT e filtragem

`SELECT *` retorna todas as colunas — em produção, prefira listar as colunas {{c1::explicitamente}} para evitar overhead e quebras quando o schema muda.

`WHERE` filtra linhas **antes** de agrupar. `{{c1::HAVING}}` filtra **depois** de agrupar com `GROUP BY`.

`LIKE 'A%'` encontra valores que {{c1::começam}} com "A". `LIKE '%A%'` encontra valores que {{c2::contêm}} "A".

`IS NULL` verifica valor nulo. `= NULL` **nunca** funciona porque `NULL {{c1::≠}} NULL` em SQL.

# JOINs

`INNER JOIN` retorna apenas linhas com {{c1::correspondência}} em ambas as tabelas.

`LEFT JOIN` retorna todas as linhas da tabela {{c1::esquerda}}, com `NULL` nas colunas da direita quando não há correspondência.

`FULL OUTER JOIN` retorna todas as linhas de {{c1::ambas}} as tabelas, com `NULL` onde não há correspondência.

`CROSS JOIN` produz o {{c1::produto cartesiano}} — cada linha da esquerda combinada com cada linha da direita.

# Agregações

As funções de agregação mais comuns são `{{c1::COUNT}}`, `{{c2::SUM}}`, `{{c3::AVG}}`, `MAX` e `MIN`.

`COUNT(*)` conta todas as linhas incluindo `NULL`. `COUNT(coluna)` conta apenas valores {{c1::não nulos}}.

```sql
SELECT department, COUNT(*) AS total, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;
```

# Subqueries e CTEs

Uma subquery correlacionada referencia colunas da query {{c1::externa}} e é reexecutada para cada linha.

CTE (Common Table Expression) com `{{c1::WITH}}` melhora a legibilidade e pode ser referenciada múltiplas vezes na query principal.

```sql
WITH vendas_por_mes AS (
  SELECT DATE_TRUNC('month', created_at) AS mes, SUM(valor) AS total
  FROM pedidos
  GROUP BY 1
)
SELECT mes, total, total - LAG(total) OVER (ORDER BY mes) AS variacao
FROM vendas_por_mes;
```

`LAG()` e `LEAD()` são {{c1::window functions}} que acessam linhas anteriores/posteriores sem necessidade de self-join.

# Índices

Um índice acelera leituras mas {{c1::penaliza}} escritas (INSERT, UPDATE, DELETE) pois precisa ser mantido.

O índice `B-tree` (padrão) é eficiente para comparações de {{c1::igualdade}} e {{c2::range}} (`>`, `<`, `BETWEEN`).

Um índice **não** é usado quando há `{{c1::função}}` aplicada na coluna indexada: `WHERE LOWER(email) = ...` não usa índice em `email` — crie um índice {{c2::funcional}} em `LOWER(email)`.

`EXPLAIN ANALYZE` mostra o plano de execução **real** com tempos — use para identificar {{c1::full table scans}} inesperados.

# Transações e ACID

ACID garante: {{c1::Atomicidade}} (tudo ou nada), {{c2::Consistência}} (estado válido), {{c3::Isolamento}} (transações não interferem), {{c4::Durabilidade}} (dados persistem após commit).

`BEGIN` / `COMMIT` / `{{c1::ROLLBACK}}` controlam transações explícitas.

Os níveis de isolamento, do mais fraco ao mais forte: `Read Uncommitted` → `{{c1::Read Committed}}` → `Repeatable Read` → `{{c2::Serializable}}`.

`Read Committed` (padrão no PostgreSQL) evita {{c1::dirty reads}} mas permite {{c2::non-repeatable reads}}.

# Constraints

`PRIMARY KEY` combina `{{c1::UNIQUE}}` + `{{c2::NOT NULL}}` e define a chave primária da tabela.

`FOREIGN KEY ... REFERENCES tabela(coluna)` garante {{c1::integridade referencial}} — não permite inserir valor que não exista na tabela referenciada.

`ON DELETE CASCADE` remove automaticamente as linhas filhas quando a linha pai é {{c1::deletada}}.

`CHECK (condição)` valida que o valor satisfaz uma condição — por exemplo, `CHECK (preco > 0)`.
