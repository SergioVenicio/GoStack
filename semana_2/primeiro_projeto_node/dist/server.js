"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
require("./database");
var PORT = 3333;
var app = express_1.default();
app.use(express_1.default.json());
app.use('', routes_1.default);
app.listen(PORT, function () {
    console.log("[APP] running ON :" + PORT);
});
