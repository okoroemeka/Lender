import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import router from './routes/Routes';

dotenv.config();
const { PORT } = process.env;
const app = express();
const port: number | string = PORT || 4220;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/v1', router);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'Fail',
    message: 'This endpoint does not exist'
  });
});
export default app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
);
