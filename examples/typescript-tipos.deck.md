---
title: TypeScript — Sistema de Tipos
description: Types, interfaces, generics, utility types e narrowing
tags:
  - typescript
  - javascript
  - frontend
version: 1
---

# Type vs Interface

`type` cria um {{c1::alias}} para qualquer tipo — primitivos, unions, tuples. `interface` só descreve {{c2::objetos}} e pode ser declarada múltiplas vezes (declaration merging).

Para objetos, prefira `interface` quando precisar de {{c1::extensão}} ou merging. Use `type` para unions, intersections e tipos calculados.

Uma `interface` é estendida com `{{c1::extends}}`. Um `type` é combinado com `{{c2::&}}` (intersection).

# Union e Intersection

`A | B` é uma {{c1::union}} — o valor pode ser **um ou outro**. `A & B` é uma {{c2::intersection}} — o valor deve satisfazer **ambos**.

```typescript
type Result = Success | Failure   // union
type Admin = User & Permissions   // intersection
```

# Generics

Generics permitem escrever código que funciona com {{c1::múltiplos tipos}} sem perder informação de tipo.

```typescript
function identity<T>(value: T): T {
  return value
}
```

A constraint `<T extends object>` restringe `T` a {{c1::tipos não primitivos}}. `<T extends keyof U>` restringe `T` a {{c2::chaves}} do tipo `U`.

# Utility Types

| Utility | O que faz |
|---------|-----------|
| `Partial<T>` | Torna todas as propriedades {{c1::opcionais}} |
| `Required<T>` | Torna todas as propriedades {{c2::obrigatórias}} |
| `Readonly<T>` | Impede {{c3::reatribuição}} de propriedades |
| `Pick<T, K>` | Seleciona um {{c4::subconjunto}} de propriedades |
| `Omit<T, K>` | Remove um {{c5::subconjunto}} de propriedades |
| `Record<K, V>` | Cria objeto com chaves `K` e valores `V` |
| `ReturnType<F>` | Extrai o tipo de {{c6::retorno}} de uma função |

`NonNullable<T>` remove {{c1::null}} e {{c2::undefined}} do tipo.

# Type Narrowing

TypeScript afunila o tipo dentro de blocos condicionais. `typeof x === 'string'` é um {{c1::type guard}} primitivo.

`x instanceof Date` afunila para {{c1::Date}}. Funciona com classes e construtores.

Uma {{c1::discriminated union}} usa um campo literal comum (discriminante) para que o TypeScript saiba qual variante está sendo tratada:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }
```

O operador `{{c1::in}}` (`'prop' in obj`) afunila para tipos que possuem aquela propriedade.

```steps
title: Criar discriminated union type-safe

1. Definir um campo literal discriminante (ex: kind) em cada variante
2. Declarar o tipo union com todas as variantes
3. Usar switch no campo discriminante para narrowing automático
4. Acessar propriedades específicas de cada variante dentro do case
5. Adicionar case default com never para garantir exhaustividade
```

# Satisfies

O operador `{{c1::satisfies}}` valida que um valor atende a um tipo **sem alterar** o tipo inferido — útil para manter tipos literais após validação.

# Template Literal Types

```typescript
type EventName = `on${Capitalize<string>}`
// 'onClick', 'onChange', etc.
```

Template literal types permitem {{c1::manipulação}} de strings no nível de tipos, combinável com `{{c2::Uppercase}}`, `Lowercase`, `Capitalize`.

# Mapped Types

```typescript
type Optional<T> = { [K in keyof T]?: T[K] }
```

O modificador `?` torna a propriedade {{c1::opcional}}. `-?` {{c2::remove}} a opcionalidade. `readonly` torna {{c3::imutável}}.
