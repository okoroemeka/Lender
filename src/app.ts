import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import router from './routes/Routes';

dotenv.config();

const app = express();
// app.set('port', 4220);
const port: number = 4220;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/v1', router);

export default app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
);
// export default app;
