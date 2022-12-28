import cors from 'cors';
import express from 'express';
import * as path from 'path';

import serverConfig from './config/serverConfig';
import routes from './routes';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();

    this.middlewares();
    this.initFTP();
    this.routes();

    process.env.base_url = serverConfig.baseUrl;
    process.env.port = String(serverConfig.port);
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private routes(): void {
    this.express.use(routes);
  }

  private initFTP(): void {
    // Permitir listar arquivos da pasta
    // this.express.use(
    //   '/images',
    //   serveIndex(path.resolve(__dirname, '..', 'images'))
    // );

    this.express.use(
      '/images',
      express.static(path.resolve(__dirname, '..', 'images')),
    );
  }
}

export default new App().express;
