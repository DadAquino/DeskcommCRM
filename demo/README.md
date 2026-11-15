# Demonstração visual

Aplicação Next.js separada para avaliar o layout do fork, com os componentes originais, uma identidade fictícia e dados de exemplo. Não exige Supabase, Redis, WhatsApp, IA ou variáveis de ambiente. O aplicativo original na raiz continua com seu fluxo normal de autenticação.

## Executar

Na raiz do repositório:

```bash
corepack pnpm@9.15.9 install --frozen-lockfile
corepack pnpm@9.15.9 exec next dev demo --webpack
```

Abra `http://localhost:3000`. Para verificar o build de produção:

```bash
corepack pnpm@9.15.9 exec next build demo --webpack
corepack pnpm@9.15.9 exec next start demo
```

## Vercel

Importe `DadAquino/DeskcommCRM`, escolha a branch `demo-visual-vercel` e defina **Root Directory = `demo`**. Habilite a inclusão de arquivos fora do diretório raiz: os componentes compartilhados ficam no repositório pai. Use Next.js e Node 22. Os comandos de instalação e build estão em `demo/vercel.json` e usam o lockfile original na raiz.

É um único aplicativo público em `/`, sem serviços Python e sem bindings. Nenhuma credencial é necessária. A pasta `experiments/extensoes` não participa do build.

## Escopo

As telas reutilizam o código visual original: funis, quadro/lista/calendário do funil, contatos e ficha, atendimento e conversa, agenda, tarefas, equipe, painel de atendimento, campanhas, empresas, agentes, propostas, conexões, desempenho, perfil e hubs de navegação. As partes ainda não adaptadas exibem uma indicação explícita e um caminho de volta.

Somente leituras de dados fictícios são atendidas. Buscas e filtros de contatos funcionam sobre os exemplos. Diálogos e formulários podem ser abertos para inspeção. Escritas, envios, integrações e Server Actions são bloqueados; nada é salvo. Não é um CRM operacional e não usa a infraestrutura do ERP.

O isolamento está no build da pasta `demo`: os aliases de `tsconfig.json` substituem os clientes Supabase e a configuração de servidor apenas nesta aplicação. `proxy.ts` recusa POSTs de Server Actions; a API demonstrativa recusa toda escrita. Nenhum guard de autenticação da aplicação original foi removido.

## Verificação

```bash
corepack pnpm@9.15.9 exec tsc -p demo/tsconfig.json --noEmit
corepack pnpm@9.15.9 exec playwright test -c demo/playwright.config.ts
```

Os testes de tela usam o servidor de produção na porta 3100 e verificam dados visíveis, busca, navegação, diálogos e recusa de escrita. Para usar outro navegador instalado, defina `DEMO_CHROMIUM_PATH`.

Destino arquitetural: infraestrutura de demonstração do fork. Não muda o núcleo nem exige ativar extensões. Entrada: fixtures em `demo/lib/data.ts`; saída: componentes originais e respostas de leitura em `demo/lib/responses.ts`. Registro visível: faixa “Demo visual” e avisos de recusa de escrita. Porta: `/`, redirecionada para Funis. Anti-morte e continuidade de atendimento não se aplicam: nenhum atendimento real existe nesta aplicação. O retorno de falhas é medido pelos testes de navegação e pelas recusas verificáveis de API.
