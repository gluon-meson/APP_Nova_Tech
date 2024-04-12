# Wealth Management

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
