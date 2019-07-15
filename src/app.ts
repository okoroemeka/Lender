import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';

dotenv.config();

const app = express();
app.set('port', 4220);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.listen(app.get('port'), () =>
  console.log(`app listening on http://localhost:${app.get('port')}`)
);
