"use strict";
var io = require('socket.io');
var player_1 = require("./game/player");
var deck_1 = require("./game/deck");
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.init = function (server) {
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (socket) {
                socket.player = new player_1.Player();
                socket.on('login', function () {
                    var date = new Date();
                    var dateFormat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    socket.emit('players', '[' + dateFormat + ']' + ' Welcome to battleship.');
                });
                socket.on('login', function (loggedUser) {
                    socket.player.username = loggedUser.username;
                    var date = new Date();
                    var dateFormat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    socket.broadcast.emit('players', '[' + dateFormat + '] ' + loggedUser.username + ': A new player has arrived.');
                });
                socket.on('chat', function (data) { return _this.io.emit('chat', socket.player.username + ': ' + data); });
                socket.on('private_chat', function (data) {
                    _this.io.to(data.privateGame).emit('private_chat', socket.player.username + ': ' + data.message);
                });
                socket.on('refresh', function (data) { return _this.io.emit('refresh'); });
                socket.on('join_game', function (data) {
                    //push array socket.id
                    var gameJoined = {
                        cards: {},
                        score: 0,
                        playerTurn: 0,
                        order: {},
                        opponents: {}
                    };
                    socket.player.games[data.game._id] = gameJoined;
                    socket.join(data.game._id);
                    _this.io.emit('update_game', { gameId: data.game._id, player: data.player });
                    var date = new Date();
                    var dateFormat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    socket.broadcast.emit('players', '[' + dateFormat + '] ' + socket.player.username + ' joined the game ' + data.game.gameName + '.');
                });
                socket.on('new_game', function (game) {
                    var deck = new deck_1.Deck();
                    var playerGame = {
                        cards: deck.cardsPlayer1,
                        score: 0,
                        order: {}
                    };
                    socket.player.games[game._id] = playerGame;
                    console.log(game);
                    socket.join(game._id);
                    socket.broadcast.emit('new_game', game);
                    var date = new Date();
                    var dateFormat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    socket.broadcast.emit('players', '[' + dateFormat + '] A new game ' + game.gameName + ' has been created by ' + socket.player.username + '.');
                });
                socket.on('cancel_game', function (game) {
                    var date = new Date();
                    var dateFormat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    socket.broadcast.emit('players', '[' + dateFormat + '] ' + socket.player.username + ' canceled the game ' + game.gameName + '.');
                });
                /////////////////////////////////////////////////////////////////////////////
                socket.on('start_game', function (game) {
                    //let deck : Deck = new Deck();
                    _this.io.to(game._id).emit('start_game', game);
                    //for(0 a 3)
                    //this.io.to(game.players[i].clindid).emit('start_game', game.dacartas());
                    //loop sock
                    //  socket.on('dar cartas', darbarCartas
                    //console.log(game);
                });
                ////////////////////////////////////////////////////////////////////////////
            });
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
    }
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
