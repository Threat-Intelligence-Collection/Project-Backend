# Use Bun as the base image
FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "run", "dev"]
