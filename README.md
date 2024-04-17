# Nova Tech

## Mainly Tech Stack

- [next.js 14](https://nextjs.org/docs), with App router
- CSS: [Tailwind CSS](https://tailwindcss.com/docs/installation)
- UI library: [shadcn/ui](https://ui.shadcn.com/docs), check the `compoents/ui` folder
- Chart: [E-chart](https://echarts.apache.org/examples/zh/index.html) and [echarts-for-react](https://www.npmjs.com/package/echarts-for-react)
- Test: [vitest](https://vitest.dev/) just basically set-up
- Node Database script for Postgres: [pg](https://www.npmjs.com/package/pg)
- **FOR LLM**
  - [openai](https://www.npmjs.com/package/openai) openai official package
  - [AI](https://sdk.vercel.ai/docs/getting-started) vercel an open source library for building AI-powered user interfaces.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
And The code was adapted from the repository [ai-chatbox](https://github.com/vercel/ai-chatbot).

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run AI Chat bot.

> Note: You should not commit your `.env` file other it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

So first, you need create the `.env.local` and take [`.env.example`](.env.example) as a reference.

then run the development server:

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## data source

The stock and Index market data is coming from [tsanghi](https://tsanghi.com/fin/doc), you can apply your own token to get more data by updating the script.

For data-source script, two ways of it to run:

- install [bun](https://bun.sh/), then eg: ` cd data-source/script && bun get_stock.ts`
- install `ts-node` and config it by yourself.

## Project Structure Introduction

Basically this project follow [next.js 14 app router](https://nextjs.org/docs/app/building-your-application/routing/colocation#store-project-files-outside-of-app) folder structure

```txt
├── .husky
├── __tests__
├── app                                      app router
│   └── chart-bot                            chart-bot router
│   │   │   └── page.tsx                     chart-bot page
│   ├── layout.tsx                           global layout
│   │── page.tsx                             home page
│   └── api
├── components
│   ├── providers
│   │   └── index.tsx                        all provdiers
│   ├── ui                                   shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   └── ...
│   └── other general components
├── config                                   common config
├── constants                                constants
├── data-scource                             chart bot data-source, all data had saved in QA db, it's irrelative for running this app
├── features                                 core bussiness layer logic
│   ├── chat-bot                             chart-bot
│   │   ├── ...
│   │   ├── actions.tsx                      core logic to handle chatting and response ui, call tools...it runs on server
│   │   ├── openaiClient.ts                  get singleton on node runtime
│   │   ├── runOpenAICompletion.tsx          call LLM and bind tool and retrun callbacks
│   │   ├── tools.ts                         customer openai tools definition
│   │   ├── utils.ts                         inside utils functions
│   └── query-bot
├── hooks                                    all hooks
│   ├── client                               just for client side
│   ├── client                               just for server side
│   ├── shared                               common use for  client and server side
├── lib                                      simlar with hooks folder, but utils
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles                                   global css
├── commitlint.config.js                     commitlint
├── next.config.js                           nextjs config
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js                        postcss config
├── tailwind.config.js                       tailwind config
├── tsconfig.json
├── ...
```

### Others Notes

- Svg icon usage: You can import icon from [`lucide-react`](https://lucide.dev/icons/)
- **Commit** rule follow [commitlint-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)

## Deploy

Before deploy, you need setup these env:

```dotenv
## chart bot
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
KNOWLEDGE_BASE_URL=xx
OFFLINE_TOKEN=xx

## query bot
WEALTH_MANAGEMENT_CHAT_URL=xx
```

so you can create `.env` file and add above envs in the root of the project

Then you can just run `sh startup.sh` to deploy.
