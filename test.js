"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.routes();
    }
    App.prototype.firstMatch = function (data) {
        return data.match(/([0|9])\1+/g);
    };
    App.prototype.secondMatch = function (data) {
        return data.split(new RegExp(['0', '9'].join('|'), 'g')).filter(Boolean);
    };
    //function to handle the version1
    App.prototype.v1 = function (datain) {
        var firstmatch = this.firstMatch(datain);
        var secondmatch = this.secondMatch(datain);
        var dataout = {
            firstName: secondmatch[0] + firstmatch[0],
            lastName: secondmatch[1] + firstmatch[1],
            clientId: firstmatch[2] + secondmatch[2]
        };
        return dataout;
    };
    //function to handle version2
    App.prototype.v2 = function (datain) {
        var firstmatch = this.firstMatch(datain);
        var secondmatch = this.secondMatch(datain);
        var dataout = {
            firstName: secondmatch[0],
            lastName: secondmatch[1],
            clientId: firstmatch[2] + '-' + secondmatch[2]
        };
        return dataout;
    };
    App.prototype.routes = function () {
        var _this = this;
        var router1 = express.Router();
        router1.post('/api/:version(v1|v2)/parse', function (req, res) {
            var reqBody = req.body;
            var ver = req.params.version;
            var data = _this["" + ver](reqBody.data);
            var response = {
                statusCode: 200,
                data: data
            };
            res.json(response);
        });
        this.express.use(bodyParser.json());
        this.express.use('', router1);
    };
    App.prototype.listen = function (port) {
        this.express.listen(port, function (err) {
            if (err) {
                return console.log(err);
            }
            return console.log("server is listening on port " + port);
        });
    };
    return App;
}());
var app = new App();
app.listen(8020);
