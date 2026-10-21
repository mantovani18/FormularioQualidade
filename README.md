# Pesquisa de Cultura — Qualidade e Segurança de Alimentos

Aplicação estática em HTML/CSS/JavaScript, preparada para GitHub Pages ou Vercel, com Supabase para armazenamento e autenticação administrativa.

## Arquivos
- `index.html`: formulário e painel administrativo (`?admin=1`)
- `styles.css`: visual responsivo
- `app.js`: perguntas, gravação, gráficos e PDF
- `supabase.sql`: tabelas e políticas de acesso
- `vercel.json`: configuração simples para hospedagem estática

## Configuração
1. Crie um projeto no Supabase.
2. Abra SQL Editor e execute todo o arquivo `supabase.sql`.
3. Em `app.js`, substitua `COLE_A_URL_DO_SEU_PROJETO` e `COLE_A_CHAVE_ANON_PUBLIC_DO_SEU_PROJETO` pelos valores em Project Settings → API. Use somente a chave `anon`/publishable no navegador. **Nunca publique a `service_role` key.**
4. No Supabase, abra Authentication → Users e crie um usuário administrador com e-mail e senha.
5. Copie o UUID desse usuário e execute no SQL Editor:
   `insert into public.survey_admins (user_id) values ('UUID-DO-USUARIO-ADMIN');`
6. Publique os arquivos na raiz de um repositório GitHub e habilite GitHub Pages, ou importe o repositório na Vercel.
7. Teste com uma resposta fictícia e confira o painel em `https://seusite/?admin=1`. Apague a resposta de teste antes da pesquisa real, se desejar.

## Perguntas e áreas
O formulário contém os campos demográficos do PDF e as afirmações 6 a 30, com escala de cinco respostas. Na pergunta Área foram incluídas `Moinho`, `Manutenção Massas` e `Manutenção Moinho`, substituindo a opção genérica `Manutenção`.

## Como funciona o PDF
O administrador entra no painel, atualiza os dados e clica em **Gerar relatório PDF**. O relatório apresenta contagem por área e um gráfico de rosca por afirmação, com contagens e percentuais. O PDF é gerado no navegador a partir dos dados atuais do banco.

## Observações importantes
- O PDF original apresenta 30 perguntas, mas as perguntas 6 a 30 são as afirmações avaliativas. O sistema mantém a numeração original.
- O nome é opcional e não aparece no PDF consolidado.
- As respostas são inseridas anonimamente; leitura do banco é restrita aos usuários listados em `survey_admins`.
- Para impedir respostas duplicadas por pessoa seria necessário definir uma regra de identificação/autenticação; o nome é opcional e não deve ser usado como identificador único.
- Antes de usar oficialmente, valide as políticas no Supabase, teste o acesso como funcionário e como administrador e confirme as exigências internas de privacidade/LGPD.
- O relatório final reproduz o estilo de gráficos de rosca do PDF de referência, mas os valores virão das respostas reais coletadas — não dos números demonstrativos do PDF antigo.
