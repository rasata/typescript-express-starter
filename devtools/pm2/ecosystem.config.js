module.exports = {
  apps: [
    {
      name: 'prod',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 'max', // CPU 코어 수만큼
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/access.log',
      error: './logs/error.log',
      merge_logs: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'dev',
      script: 'ts-node',
      args: '-r tsconfig-paths/register --transpile-only src/server.ts',
      exec_mode: 'fork', // dev는 cluster 사용 X
      instances: 1,
      autorestart: true,
      watch: ['src'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      output: './logs/access.log',
      error: './logs/error.log',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
    },
  ],
  deploy: {
    production: {
      user: 'user',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/home/user/app',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
