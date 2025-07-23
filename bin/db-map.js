export const TEMPLATE_DB = {
  default: null,
  graphql: 'postgres',
  knex: 'mysql',
  mikroorm: 'mongo',
  mongoose: 'mongo',
  'node-postgres': 'postgres',
  prisma: 'mysql',
  sequelize: 'mysql',
  typegoose: 'mongo',
  typeorm: 'postgres',
};

export const DB_SERVICES = {
  postgres: `
  pg:
    container_name: pg
    image: postgres:14.5-alpine
    ports:
      - "5432:5432"
    env_file:
      - .env.development.local
    restart: always
    networks:
      - backend
  `,
  mysql: `
  mysql:
    container_name: mysql
    image: mysql:5.7
    ports:
      - "3306:3306"
    env_file:
      - .env.development.local
    networks:
      - backend
  `,
  mongo: `
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"
    env_file:
      - .env.development.local
    networks:
      - backend
  `,
};

export const BASE_COMPOSE = (dbSnippet = '') => `
version: '3.9'

services:
  proxy:
    container_name: proxy
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - server
    restart: unless-stopped
    networks:
      - backend

  server:
    container_name: server
    build:
      context: ./
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - ./:/app:cached
      - /app/node_modules
    env_file:
      - .env.development.local
    depends_on:
      - ${dbSnippet ? dbSnippet.match(/^\s*(\w+):/)?.[1] : ''}
    restart: unless-stopped
    networks:
      - backend

${dbSnippet.trim() ? dbSnippet : ''}

networks:
  backend:
    driver: bridge

volumes:
  pgdata:
    driver: local
`;
