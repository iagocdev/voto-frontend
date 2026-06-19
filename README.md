#  VotoConsciente — Frontend

> **Descubra quem os seus votos ajudam a eleger.**
> Interface Angular que visualiza o Efeito Arrastão do sistema eleitoral proporcional brasileiro.

---

##  Sobre o Projeto

No sistema proporcional brasileiro, votar em um candidato pode eleger outro. Esse fenômeno, conhecido como **Efeito Arrastão**, acontece porque os votos se somam dentro de uma federação ou partido para definir quantas vagas cada grupo conquista.

O **VotoConsciente** expõe esse mecanismo de forma clara: o eleitor informa o número do candidato, o estado e o cargo, e a aplicação exibe todos os outros candidatos da mesma federação que seriam beneficiados por esse voto.

**Repositório backend:** [iagocdev/voto-backend](https://github.com/iagocdev/voto-backend)

---

##  Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Angular | 21.2 |
| Linguagem | TypeScript | 5.9 |
| HTTP Client | Angular HttpClient | nativo |
| Formulários | Angular FormsModule | nativo |
| Testes | Vitest | 4.0 |
| Formatação | Prettier | 3.8 |
| Runtime | Node.js | 20+ |
| Package Manager | npm | 10.9+ |

---

##  Arquitetura

```
src/
└── app/
    ├── app.ts               # Componente raiz — lógica de busca e renderização
    ├── app.html             # Template do Simulador de Efeito Arrastão
    ├── app.css              # Estilos do componente principal
    ├── app.config.ts        # Configuração global (providers, router, HttpClient)
    ├── app.routes.ts        # Definição de rotas
    ├── models/
    │   └── candidato.model.ts   # Interfaces TypeScript (Candidato, ResultadoArrastaoDTO)
    └── services/
        └── candidato.ts         # CandidatoService — comunicação com a API REST
```

### Decisões técnicas notáveis

**Comunicação com a API:** o `CandidatoService` utiliza o `HttpClient` nativo do Angular com `HttpParams` para montar os parâmetros da query string de forma tipada e segura.

**Controle de renderização (`ChangeDetectorRef`):** o Angular 21 opera em modo mais rigoroso de detecção de mudanças. O `ChangeDetectorRef.detectChanges()` é chamado explicitamente após a resolução do Observable do `HttpClient`, garantindo que a interface atualize imediatamente após o retorno da API — sem depender de interações do usuário como gatilho.

**Configuração limpa (`app.config.ts`):** o `provideClientHydration(withEventReplay())` foi removido intencionalmente. Essa opção é voltada para SSR (Server-Side Rendering) e causava interferência no ciclo de vida dos eventos em aplicações SPA puras, segurando os resultados de requisições HTTP antes de renderizá-los.

---

##  Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- Angular CLI 21+
- Backend rodando em `http://localhost:8080` ([voto-backend](https://github.com/iagocdev/voto-backend))

### 1. Clone o repositório

```bash
git clone https://github.com/iagocdev/voto-frontend.git
cd voto-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute a aplicação

```bash
npm start
# ou
ng serve
```

A aplicação estará disponível em `http://localhost:4200`.

---

##  Como Usar

1. Digite o **número do candidato** na urna (ex: `1234`)
2. Informe a **UF** do estado (ex: `DF`)
3. Selecione o **cargo** (`Deputado Federal` ou `Deputado Estadual`)
4. Clique em **Pesquisar**

A tela exibirá o candidato buscado e todos os outros candidatos da mesma federação que seriam beneficiados pelo seu voto naquele estado.

---

##  Integração com o Backend

O frontend consome a seguinte rota da API:

```
GET http://localhost:8080/api/candidatos/impacto
  ?numero=1234
  &estadoUf=DF
  &cargo=Deputado Federal
```

O `estadoUf` é sempre enviado em maiúsculo (`.toUpperCase()`) antes da requisição.

---

## Testes

```bash
npm test
```

Os testes utilizam **Vitest** como runner.

---

##  Licença

Projeto de código aberto para fins educacionais e de portfólio.

---

*Desenvolvido por [Iago](https://github.com/iagocdev) — Angular & TypeScript*
