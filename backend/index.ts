require('dotenv').config()
import 'source-map-support/register';
import path from 'path';
import { OpenApiValidator } from 'express-openapi-validator';
import { sequelize } from './src/config/database';
import { verifyAccessToken } from './src/middlewares/jwtController';
import express, { Application, Request, Response, NextFunction } from 'express';

class App {
  public app: Application;
  public port: number;
  public schemaPath = '../schema.yaml'

  constructor() {
    this.app = express();
    this.port = parseInt(`${process.env.PORT}`, 10) || 3001;
    this.init();
  }

  public init = async () => {
    try {
      console.log('Initializing Database...')
      await this.initializeDatabase();
      console.log('Initialize Database success')

      console.log('Initialize Middlewares...')
      this.initializeMiddlewares();
      console.log('Initialize Middlewares succcess')

      console.log('Initialize Routes...')
      await this.initializeRoutes();
      console.log('Initialize Routes success')

      console.log('Opening server')
      this.listen(this.port);

    } catch (e) {
      console.log('Server errored');
      console.log(e);
    }
  }

  public allowCrossDomain = function (request: Request, response: Response, next: NextFunction) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // response.header('Access-Control-Allow-Headers', 'Content-Type,accessToken');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  public async initializeDatabase() {
    await sequelize.sync({ force: true }); // false, to keep databsae intact
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(this.allowCrossDomain);
    this.app.use(express.text());
    this.app.use(express.urlencoded({ extended: false }));
  }

  // private initializeRoutes() {
  //   this.app.use(OpenApiValidator.middleware({
  //     apiSpec: this.schemaPath,
  //     validateResponses: true,
  //     operationHandlers: path.join(__dirname, 'src'),
  //     validateSecurity: {
  //       handlers: {
  //         BearerAuth: (req: any, scopes: any, schema: any) => {
  //           return new Promise((resolve, reject) => {
  //             verifyAccessToken(
  //               req,
  //               (successBoolean: any) => {
  //                 resolve(successBoolean);
  //               },
  //               (errorMessage: any) => {
  //                 reject(errorMessage);
  //               }
  //             );
  //           });
  //         },
  //       }
  //     },
  //   }))
  //   this.app.use((err: any, req: any, res: any, next: any) => {
  //     let errors = [];
  //     if (err.errors) {
  //       errors = err.errors.map((error: any) => ({
  //         message: error.message,
  //       }))
  //     }
  //     res.status(err.status || 500).json({
  //       timestamp: new Date().toUTCString(),
  //       status: err.status || 500,
  //       name: err.name,
  //       message: err.message,
  //       errors: errors || err.errors,
  //     });
  //   });
  // }
  private async initializeRoutes() {
    await new OpenApiValidator({
      apiSpec: this.schemaPath,
      validateResponses: true,
      validateRequests: false,
      operationHandlers: path.join(__dirname, 'src'),
      validateSecurity: {
        handlers: {
          BearerAuth: (req: any, scopes, schema) => {
            return new Promise((resolve, reject) => {
              verifyAccessToken(
                req,
                (successBoolean: any) => {
                  resolve(successBoolean);
                },
                (errorMessage: any) => {
                  reject(errorMessage);
                }
              );
            });
          },
        }
      },
    })
      .install(this.app)
      .then(() => {
        this.app.use((err: any, req: any, res: any, next: any) => {
          let errors = [];
          if (err.errors) {
            errors = err.errors.map((error: any) => ({
              message: error.message,
            }))
          }
          res.status(err.status || 500).json({
            timestamp: new Date().toUTCString(),
            status: err.status || 500,
            name: err.name,
            message: err.message,
            errors: errors || err.errors,
          });
        });
      })
  }
}

const app = new App();
