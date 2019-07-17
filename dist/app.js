"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const logger = require("morgan");
const Routes_1 = require("./routes/Routes");
dotenv.config();
const app = express();
// app.set('port', 4220);
const port = 4220;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/api/v1', Routes_1.default);
exports.default = app.listen(port, () => console.log(`app listening on http://localhost:${port}`));
// export default app;
//# sourceMappingURL=app.js.map