# Wealth Management

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
And The code was adapted from the repository [ai-chatbox](https://github.com/vercel/ai-chatbot).

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run AI Chat bot.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

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
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
```

And you also need check the `env_file` path in [docker-compose.yml](./docker-compose.yml)

Then you can just run `sh startup.sh` to deploy.

## Data Transformation Script

This project includes a script for data transformation, which can be run using the following command:

```bash
pnpm run transform-data
```

- Files that need to be processed should be placed in the data folder
- Processed content output.json is in the public folder
- The processed file will be recorded in the processedHash file of temp
