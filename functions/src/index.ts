import { graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import cors = require('cors');
import express = require('express');
import { https } from 'firebase-functions';

import authentication from './authentication';
import schema from './schema';

const app = express();

app.use(cors());
app.use(authentication);

app.options('*', cors());
app.post('/graphql', bodyParser.json(), graphqlExpress({ schema }));

export const functions = https.onRequest(app);
