"use strict";
var mongodb = require('mongodb');
var util = require('util');
var app_database_1 = require("./app.database");
var Game = (function () {
    function Game() {
        var _this = this;
        this.handleError = function (err, response, next) {
            response.send(500, err);
            next();
        };
        this.returnGame = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: id
            })
                .then(function (game) {
                if (game === null) {
                    response.send(404, 'Game not found');
                }
                else {
                    response.json(game);
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getGames = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .find()
                .toArray()
                .then(function (games) {
                response.json(games || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            _this.returnGame(id, response, next);
        };
        this.updateGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var game = request.body;
            if (game === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            delete game._id;
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $set: game
            })
                .then(function (result) { return _this.returnGame(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createGame = function (request, response, next) {
            var game = request.body;
            if (game === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .insertOne(game)
                .then(function (result) { return _this.returnGame(result.insertedId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.deleteGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('games')
                .deleteOne({
                _id: id
            })
                .then(function (result) {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Game -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getMyGames = function (request, response, next) {
            var user_id = request.params.id;
            app_database_1.databaseConnection.db.collection('games')
                .find({ creatorId: user_id, state: 'pending' })
                .toArray()
                .then(function (games) {
                response.json(games || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.joinGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var newPlayer = request.body;
            if (id === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $push: { players: newPlayer }
            })
                .then(function (result) { return _this.returnGame(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.cancelGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            if (id === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $set: { state: 'canceled' }
            })
                .then(function (result) { return _this.returnGame(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.updateStateGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var time = new Date();
            var dformat = [time.getDate(),
                time.getMonth() + 1,
                time.getFullYear()].join('/') + ' ' +
                [time.getHours(),
                    time.getMinutes(),
                    time.getSeconds()].join(':');
            if (id === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, { $set: { state: 'playing', gameStart: dformat } })
                .then(function (result) { return _this.returnGame(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.updateGameScore = function (request, response, next) {
            var gameId = new mongodb.ObjectID(request.params.gameId);
            var userId = request.params.userId;
            if (gameId === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: gameId, "players.player": userId
            }, { $set: { "players.$.score": request.body.score } })
                .then(function (result) { return _this.returnGame(gameId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.updateGameVictory = function (request, response, next) {
            var gameId = new mongodb.ObjectID(request.params.gameId);
            var userId = request.params.userId;
            var time = new Date();
            var dformat = [time.getDate(),
                time.getMonth() + 1,
                time.getFullYear()].join('/') + ' ' +
                [time.getHours(),
                    time.getMinutes(),
                    time.getSeconds()].join(':');
            if (gameId === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: gameId, "players.player": userId
            }, { $set: {
                    state: 'ended',
                    winner: request.body.username,
                    gameEnd: dformat,
                    "players.$.score": request.body.score
                }
            })
                .then(function (result) { return _this.returnGame(gameId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayedGames = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .find({ $or: [{ state: 'ended' }, { state: 'playing' }] })
                .toArray()
                .then(function (games) {
                response.json(games || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            server.get(settings.prefix + 'games', _this.getGames);
            server.get(settings.prefix + 'history', _this.getPlayedGames);
            server.get(settings.prefix + 'games/:id', settings.security.authorize, _this.getGame);
            server.get(settings.prefix + 'mygames/:id', settings.security.authorize, _this.getMyGames);
            server.post(settings.prefix + 'games', settings.security.authorize, _this.createGame);
            server.put(settings.prefix + 'joingame/:id', settings.security.authorize, _this.joinGame);
            server.put(settings.prefix + 'games/:id/cancel', settings.security.authorize, _this.cancelGame);
            server.put(settings.prefix + 'games/:gameId/updatescore/:userId', settings.security.authorize, _this.updateGameScore);
            server.put(settings.prefix + 'games/:gameId/updatevictory/:userId', settings.security.authorize, _this.updateGameVictory);
            server.put(settings.prefix + 'gamestate/:id', settings.security.authorize, _this.updateStateGame);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, _this.updateGame);
            server.del(settings.prefix + 'games/:id', settings.security.authorize, _this.deleteGame);
            console.log("Games routes registered");
        };
    }
    return Game;
}());
exports.Game = Game;
