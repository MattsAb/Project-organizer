FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN cd frontend && npm install
RUN cd backend && npm install

COPY . .

RUN cd frontend && npm run build

ENV DATABASE_URL=postgresql://postgres:password@db:5432/myapp
RUN cd backend && npx prisma generate

WORKDIR /app/backend

EXPOSE 5000

CMD ["sh", "-c", "until nc -z db 5432; do echo 'waiting for db...'; sleep 1; done && npx prisma db push && node src/server.js"]