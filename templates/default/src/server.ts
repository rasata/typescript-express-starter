import { Container } from 'typedi';
import App from '@/app';
import { validateEnv } from '@config/validateEnv';
import { UsersRepository } from '@repositories/users.repository';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';

// 환경변수 유효성 검증
validateEnv();

// DI 등록
Container.set('UsersRepository', new UsersRepository());

// 라우트 모듈을 필요에 따라 동적으로 배열화 가능
const routes = [Container.get(UsersRoute), Container.get(AuthRoute)];

// API prefix는 app.ts에서 기본값 세팅, 필요하면 인자로 전달
const appInstance = new App(routes);

// listen()이 서버 객체(http.Server)를 반환하도록 app.ts를 살짝 수정
const server = appInstance.listen();

// Graceful Shutdown: 운영환경에서 필수!
if (server && typeof server.close === 'function') {
  // SIGINT: Ctrl+C, SIGTERM: Docker/k8s kill 등
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log(`Received ${signal}, closing server...`);
      server.close(() => {
        console.log('HTTP server closed gracefully');
        // 필요하면 DB/Redis 등 외부 자원 해제 코드 추가
        process.exit(0);
      });
    });
  });
}

// 테스트 코드 등에서 서버 객체 활용하고 싶으면
export default server;
