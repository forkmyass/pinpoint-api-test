var jade = require("jade");
var fs = require("fs");
var babel = require("babel");

var srcFolder = __dirname + "/src";
var distFolder = __dirname + "/dist";

fs.writeFileSync(distFolder + "/test/api.js", babel.transformFileSync(srcFolder + "/test/api.js", {stage: 0}).code);

var html = jade.renderFile("./views/index.jade", {});
fs.writeFileSync("./index.html", html);
