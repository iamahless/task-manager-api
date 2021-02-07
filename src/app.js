const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
require('@knuckleswtf/scribe')(app)


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);