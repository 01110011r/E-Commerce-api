import "dotenv/config";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import MySchema from "./modules";
import { newSequelize } from "./config";
import { graphqlUploadExpress } from "graphql-upload-ts"
import seeds from "./seeds";
import { route } from "./router";




async function main(): Promise<void> {

  try {
    await newSequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  interface MyContext {
    token?: String;
  }

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    schema: MySchema,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

  });
  await server.start();


  app.use('/',
    route,
    graphqlUploadExpress({ maxFileSize: 10000000, maxFile: 3 }),
    cors<cors.CorsRequest>(),
    bodyParser.json({ limit: '20mb' }),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ token: req.headers.token, req, res }),
    }),
  );

  const port: number = Number(process.env.PORT) || 5555

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/`);


};


main();


// seed
seeds();