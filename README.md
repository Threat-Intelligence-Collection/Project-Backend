# Elysia with Bun runtime

## Getting Started
Every one should be install bun to your labtop. [bun run time use instread node.js]
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Build Step
1. Create docker network name project-network.
```bash
docker network create project-network
```
2. After that copy .env.example to .env.
```bash
cp cp .\.env.example .env
```
3. Copy .env in our discord channel secret (dangerous zone!!!) this file must not put to our git repository.
4. After that docker compose up our container.
```bash
docker compose up -d
```
5. Install node-postgres package.
```bash
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit tsx @types/pg
```
Alternative way.
```bash
bun add drizzle-orm pg dotenv
bun add -D drizzle-kit tsx @types/pg
```
6. Applying changes to the database
```bash
npx drizzle-kit push
```
Alternative way.
```bash
bunx drizzle-kit push
```
7. Alternatively, you can generate migrations using the drizzle-kit generate command and then apply them using the drizzle-kit migrate command.
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
Akternative way.
```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```
And go to next phase development phase.....
## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.