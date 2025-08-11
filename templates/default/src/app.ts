import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  NODE_ENV, PORT, LOG_FORMAT, CREDENTIALS,
  CORS_ORIGIN_LIST, API_SERVER_URL,
} from '@config/env';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[], apiPrefix = '/api/v1') {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeTrustProxy();
    this.initializeMiddlewares();
    this.initializeRoutes(routes, apiPrefix);
    this.initializeSwagger(apiPrefix);
    this.initializeErrorHandling();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });

    return server;
  }

  public getServer() {
    return this.app;
  }

  private initializeTrustProxy() {
    // Nginx, Heroku, Cloudflare 등 프록시 환경에서 실IP 추출을 위해 필요
    this.app.set('trust proxy', 1);
  }

  private initializeMiddlewares() {
    this.app.use(
      rateLimit({
        windowMs: 60 * 1000, // 1분
        max: this.env === 'production' ? 100 : 0, // 개발환경에서는 제한 없음
        message: { error: 'Too many requests, please try again later.' },
        keyGenerator: req => req.ip || '', // 신뢰 프록시 하에서 실IP, undefined 방지
        skip: req => this.env !== 'production' || req.ip === '127.0.0.1',
        legacyHeaders: false,
        standardHeaders: true,
      }),
    );

    this.app.use(morgan(LOG_FORMAT || 'dev', { stream }));

    // CORS 화이트리스트를 환경변수에서 관리
    const allowedOrigins = CORS_ORIGIN_LIST.length > 0
      ? CORS_ORIGIN_LIST
      : ['http://localhost:3000'];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: CREDENTIALS,
      }),
    );

    this.app.use(hpp());
    this.app.use(
      helmet({
        contentSecurityPolicy:
          this.env === 'production'
            ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
              },
            }
            : false, // 개발 환경에서는 CSP 비활성화 (hot reload 등 편의)
        referrerPolicy: { policy: 'no-referrer' },
      }),
    );
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[], apiPrefix: string) {
    routes.forEach(route => {
      this.app.use(apiPrefix, route.router);
    });
  }

  private initializeSwagger(apiPrefix: string) {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example API Documentation',
        },
        servers: [
          {
            url: API_SERVER_URL || `http://localhost:${this.port}${apiPrefix}`,
            description: this.env === 'production' ? 'Production server' : 'Local server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['swagger.yaml', 'src/controllers/*.ts'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}

export default App;
