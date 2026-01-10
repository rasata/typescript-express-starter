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

const DB_SERVICES = {
  postgres: `
  pg:
    container_name: pg
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always
    networks:
      - backend
  `,
  mysql: `
  mysql:
    container_name: mysql
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: \${MYSQL_DATABASE}
      MYSQL_USER: \${MYSQL_USER}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD}
    volumes:
      - mysqldata:/var/lib/mysql
    restart: always
    networks:
      - backend
  `,
  mongo: `
  mongo:
    container_name: mongo
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: \${MONGO_DATABASE}
    volumes:
      - mongodata:/data/db
    restart: always
    networks:
      - backend
  `,
};

// DB별 서비스명 맵핑
const DB_SERVICE_NAMES = {
  postgres: 'pg',
  mysql: 'mysql',
  mongo: 'mongo',
};

// 서비스 생성 헬퍼 함수
const generateServices = (dbSnippet = '', dbType = null) => {
  // depends_on 조건부 생성
  const dependsOn =
    dbType && DB_SERVICE_NAMES[dbType]
      ? `    depends_on:
      - ${DB_SERVICE_NAMES[dbType]}`
      : '';

  // 볼륨 설정 동적 생성
  const volumes = dbType ? generateVolumes(dbType) : '';

  return `version: '3.9'

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
${dependsOn}
    restart: unless-stopped
    networks:
      - backend

${dbSnippet.trim()}

networks:
  backend:
    driver: bridge
${volumes}`;
};

// 볼륨 생성 헬퍼 함수
function generateVolumes(dbType) {
  const volumeMap = {
    postgres: `
volumes:
  pgdata:
    driver: local`,
    mysql: `
volumes:
  mysqldata:
    driver: local`,
    mongo: `
volumes:
  mongodata:
    driver: local`,
  };

  return volumeMap[dbType] || '';
}

// 설정 검증 함수
export function validateDbTemplate(template) {
  if (!template || !TEMPLATE_DB.hasOwnProperty(template)) {
    throw new Error(
      `Invalid template: ${template}. Available templates: ${Object.keys(TEMPLATE_DB).join(', ')}`,
    );
  }
  return TEMPLATE_DB[template];
}

// 완전한 docker-compose 생성 함수
export function generateDockerCompose(template) {
  const dbType = validateDbTemplate(template);
  if (!dbType) {
    return generateServices();
  }

  const dbSnippet = DB_SERVICES[dbType];
  if (!dbSnippet) {
    throw new Error(`Database service configuration not found for: ${dbType}`);
  }

  return generateServices(dbSnippet, dbType);
}
