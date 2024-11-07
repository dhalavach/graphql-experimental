"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var routes_1 = require("./routes");
var app = (0, express_1.default)();
var PORT = 3000;
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.listen(PORT, function () {
    console.log("Ontology service running on http://localhost:".concat(PORT));
});
