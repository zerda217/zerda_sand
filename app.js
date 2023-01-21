import { createServer } from 'http';
import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

import resolvers from  './Controller/resolvers.js';
import typeDefs from './Controller/typeDefs.js';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

import log from 'npmlog';

(async () => {
    const PORT = 4000;
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({ schema });
    await server.start();
    server.applyMiddleware({ app });

    httpServer.listen(PORT, async () => {
        console.log(
            `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
        );
        console.log(
            `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
        );

        log.info('고양이에게 모래를 지급합니다.', '야옹 :D')
    });

    app.get('/', (req, res)=>{            
            res.end('yaho')}
    )
    app.get('/playground', expressPlayground.default({endpoint:'/graphql'}))
})();