# 🚀 Rodando o Projeto

## 🧩 1️⃣ Backend

```bash
cd backend
npm i
````

Crie o arquivo **`backend/.env`** com o seguinte conteúdo:

```ini
PORT=3000
SECRET_KEY=uma_chave_bem_secreta
# opcional (para IA)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ O arquivo `.env` deve ficar dentro da pasta **`/backend`**.

Execute o servidor:

```bash
npm run dev
```

### 🔎 Testes rápidos:

| Rota                      | Descrição                                | Exemplo de retorno |
| ------------------------- | ---------------------------------------- | ------------------ |
| `GET /health`             | Verifica se o backend está online        | `{ "ok": true }`   |
| `GET /profiles`           | Lista os perfis paginados                | `[{...}]`          |
| `GET /data/profiles.json` | Retorna o arquivo estático com os perfis | `[{...}]`          |

> 💡 Se o arquivo **`backend/data/profiles.json`** não existir, os endpoints o criam automaticamente.

---

## 💻 2️⃣ Frontend

```bash
cd ../frontend
npm i
```

Crie o arquivo **`frontend/.env`**:

```ini
VITE_API_URL=http://localhost:3000
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:
👉 [http://localhost:5173](http://localhost:5173)

---

## 👤 Fluxo Básico de Uso

1. Acesse **`/register`** pelo botão **“Criar Perfil”**.
2. Preencha a seção **Conta** com **usuário e senha**.
3. Complete o **Perfil** com nome, cargo, resumo, localização, área, etc.
4. Escolha uma **foto** (da galeria ou upload).
5. Use os botões de **IA** para sugerir:

   * 💡 **Skills técnicas**
   * 💬 **Soft skills**
   * 🧠 **Área e resumo profissional**
6. Clique em **“Criar conta + Card”** → o sistema realiza:

   * Registro do usuário
   * Login automático
   * Criação do perfil
7. Você será redirecionado para a **Home**, onde o **novo card aparecerá automaticamente**.

> ⚙️ A Home refaz o carregamento de perfis sempre que a URL contém `?_t=timestamp`, garantindo que novos cards apareçam imediatamente após o cadastro.

---