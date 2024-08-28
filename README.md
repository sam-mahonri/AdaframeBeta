# Sobre o Adaframe
Adaframe foi um protótipo de um sistema de gerenciamento de projetos, onde era possivel criar, editar, excluir, compartilhar, agrupar, privar e publicar quadros, é muito semelhante ao Trello.
O projeto foi abandonado por ter sido algo escolar, mas para ficar de lembrança, tá aí.

## Problemas de segurança
Como eu estava começando na programação de back/front, eu não tinha me preocupado tanto com algumas questões de segurança básica, como hash de senhas, confirmação de emails e rate limit, algo que eu poderia ter feito.

## Como esse sistema poderia ser recriado do zero?
Este projeto tem um backend Python + Flask e frontend feito em Javascript Vanilla, puro, todas as interações ocorriam em um "SPA", feito do zero, sem framework, esse projeto poderia ser reescrito do zero usando frameworks fullstack como NextJS, Angular, NuxtJS etc.

## Como testar em minha máquina?
Este projeto conecta a um banco de dados Redis que deve estar instalado em sua máquina para ser usado, configure e insira as credenciais em um arquivo `.env` que fica na raiz do projeto, apenas copie e cole o `.env.example` no mesmo lugar e renomeie para `.env`.
Feito isso, com o terminal na mesma pasta raiz do projeto, é opcional, mas preferível, que você crie um ambiente virtual Python digitando o seguinte (se estiver no Linux, use `python3` e não `python`):
```
python -m venv .venv
```
Ative o ambiente virtual executando:
No Windows: `.venv\Scripts\activate`
No macOS e Linux: `source .venv/bin/activate`

Feito isso, você pode instalar as dependencias que estão localizadas no `requirements.txt`, para fazer isso de forma automatica, execute:
```
pip install -r requirements.txt
```
---
Agora que você tem tudo configurado, revise, o servidor do banco de dados Redis deve estar ativo, e todas as dependencias devem estar instaladas (o motivo para ter criado um ambiente virtual é para isolar as dependencias do projeto do resto do sistema, então todas as bibliotecas instaladas pelo pip (se você criou e ativou o VENV) serão guardadas nessa pasta)

Feito isso, execute o servidor local usando:

```
flask run
```
Agora você pode usar o Adaframe no seu localhost.
