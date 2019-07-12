import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
app.set('port', 4220);

app.use(bodyParser.json());


app.listen(app.get('port'), () =>
  console.log(`app listening on http://localhost:${app.get('port')}`)
);