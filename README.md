# Gestão de Alunos

Aplicação de página única para cadastrar alunos, acompanhar notas e médias e editar ou remover registros. Os dados ficam salvos no `localStorage` do navegador.

## 🚀 Funcionalidades

* Cadastro, edição e exclusão de alunos
* Cálculo automático da média entre duas notas
* Situação calculada automaticamente: aprovado a partir de média 6,0
* Busca por nome e resumo da quantidade de aprovados e reprovados
* Persistência local no navegador
* Formulário responsivo com validação de nome e notas entre 0 e 10

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (ES6+), sem dependências externas
* Programação Orientada a Objetos
* LocalStorage do navegador

## 📂 Estrutura do Projeto

```text
gestao-alunos/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

## Conceitos Aplicados

* Classes e Objetos
* Construtores
* Métodos
* Manipulação do DOM
* Eventos
* Arrays
* LocalStorage
* Validação nativa de formulários
* Renderização de conteúdo pelo DOM

## Regras do Sistema

* O cadastro exige nome, Nota 1 e Nota 2.
* As notas aceitam valores de 0 a 10, com incrementos de 0,1.
* A média é a soma das duas notas dividida por dois.
* Média maior ou igual a 6,0: aprovado. Média menor que 6,0: reprovado.

## Armazenamento

Os dados são armazenados localmente utilizando o LocalStorage do navegador, permitindo que os registros permaneçam salvos mesmo após atualizar a página.

## Responsividade

O sistema possui layout responsivo para utilização em computadores, tablets e smartphones.

## Como Executar

1. Faça o download ou clone este repositório.
2. Abra `index.html` em um navegador moderno.
3. Cadastre um aluno pelo formulário. Use **Editar** ou **Excluir** na lista para gerenciar registros.

## Autor

Vinícius Blesa

Projeto desenvolvido para fins de estudo e prática de JavaScript e Programação Orientada a Objetos.