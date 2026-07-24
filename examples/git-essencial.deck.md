---
title: Git Essencial
description: Comandos, fluxos e conceitos fundamentais do Git
tags:
  - git
  - vcs
  - devops
version: 1
---

# Áreas do Git

O Git organiza o trabalho em três áreas: o {{c1::working directory}} (arquivos editados), o {{c2::staging area}} (index, arquivos marcados para commit) e o {{c3::repositório}} (histórico de commits).

O comando `git add` move mudanças do {{c1::working directory}} para o {{c2::staging area}}.

# Comandos de inspeção

`git status` mostra quais arquivos estão {{c1::modificados}}, {{c2::staged}} ou {{c3::untracked}}.

`git log --oneline` exibe o histórico de commits em formato compacto, com {{c1::hash abreviado}} e mensagem.

`git diff` mostra diferenças entre o {{c1::working directory}} e o {{c2::staging area}}. Para comparar staged vs último commit, use `git diff {{c3::--staged}}`.

# Branches

O comando `git checkout -b nome` cria e muda para um novo branch — equivalente a `git switch {{c1::-c}} nome` na sintaxe moderna.

`git merge` integra histórico de outra branch criando um {{c1::merge commit}}. Já `git rebase` {{c2::reescreve}} os commits sobre a branch de destino, produzindo histórico linear.

Um {{c1::fast-forward}} ocorre quando a branch de destino não divergiu, e o ponteiro simplesmente avança.

# Desfazendo mudanças

`git restore arquivo` descarta mudanças no {{c1::working directory}}. `git restore --staged arquivo` remove do {{c2::staging area}} sem alterar o arquivo.

`git revert <hash>` cria um **novo commit** que desfaz as mudanças — seguro para branches {{c1::compartilhados}}. Já `git reset --hard` reescreve o histórico e é destrutivo.

# Remotos

`git fetch` baixa objetos do remoto **sem** {{c1::mesclar}} no branch local. `git pull` equivale a `git fetch` seguido de `git {{c2::merge}}`.

`git push -u origin nome` envia o branch e define o {{c1::upstream}} para futuros `push`/`pull` sem precisar especificar o remoto.

# Stash

`git stash` salva as mudanças atuais em uma {{c1::pilha}} temporária e restaura o working directory para o estado limpo do último commit.

`git stash pop` restaura as mudanças e as {{c1::remove}} da pilha. `git stash apply` restaura mas {{c2::mantém}} a entrada na pilha.
