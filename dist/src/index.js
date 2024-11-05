"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("./config");
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: "http://localhost:4000",
    credentials: true,
};
const app = (0, express_1.default)();
//template engine
app.set('view engine', 'pug');
app.set('views', '${__dirname}/views');
app.use((0, cors_1.default)(corsOptions));
app.use(logger_1.default);
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.listen(3000, () => {
    console.log("server is running on port 3000");
});
