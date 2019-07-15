"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const logger = require("morgan");
dotenv.config();
const app = express();
app.set('port', 4220);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.listen(app.get('port'), () => console.log(`app listening on http://localhost:${app.get('port')}`));
//# sourceMappingURL=app.js.map