FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
COPY src ./src

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "dev"]