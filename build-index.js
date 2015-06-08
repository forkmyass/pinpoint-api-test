var jade = require("jade");
var fs = require("fs");

var html = jade.renderFile("./views/index.jade", {});

fs.writeFileSync("./index.html", html);
