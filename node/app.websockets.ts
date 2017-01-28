
const io = require('socket.io');

import { Player } from "./game/player";
import { Deck } from "./game/deck";

export class WebSocketServer {

    public io: any;

    public init = (server: any) => {
        this.io = io.listen(server);

        this.io.sockets.on('connection', (socket: any) => {
            socket.player = new Player();

            socket.on('login', () => {
                let date = new Date();
                let dateFormat = [date.getDate(),  date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                socket.emit('players', '['+dateFormat+']' + ' Welcome to battleship.');
            });

            socket.on('login', (loggedUser) => {
                socket.player.username = loggedUser.username;

                let date = new Date();
                let dateFormat = [date.getDate(),  date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                socket.broadcast.emit('players', '['+dateFormat+'] '+ loggedUser.username + ': A new player has arrived.');
            });

            socket.on('chat', (data) => this.io.emit('chat', socket.player.username + ': ' + data));

            socket.on('private_chat', (data) => {
                this.io.to(data.privateGame).emit('private_chat', socket.player.username + ': ' + data.message);
            });

            socket.on('refresh', (data) => this.io.emit('refresh'));

            socket.on('join_game', (data) => {
                    //push array socket.id
                let gameJoined = {
                    cards: {},
                    score: 0,
                    playerTurn: 0,
                    order: {},
                    opponents: {}
                    //arrcliensocktid[]
                };

                socket.player.games[data.game._id] = gameJoined;
                socket.join(data.game._id);
                this.io.emit('update_game', { gameId: data.game._id , player: data.player });

                let date = new Date();
                let dateFormat = [date.getDate(),  date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

                socket.broadcast.emit('players', '['+dateFormat+'] '+socket.player.username+ ' joined the game '+data.game.gameName+'.');
            });

            socket.on('new_game', (game) => {

                let playerGame = {
                    cards: {},
                    score: 0,
                    order: {}
                };
                socket.player.games[game._id] = playerGame;

                console.log(game);

                socket.join(game._id);
                socket.broadcast.emit('new_game', game);

                let date = new Date();
                let dateFormat = [date.getDate(),  date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

                socket.broadcast.emit('players', '['+dateFormat+'] A new game '+game.gameName+' has been created by '+socket.player.username+'.');
            });

            socket.on('cancel_game', (game) => {
                let date = new Date();
                let dateFormat = [date.getDate(),  date.getMonth() + 1, date.getFullYear()].join('/') + ' - ' +
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

                socket.broadcast.emit('players', '['+dateFormat+'] '+socket.player.username+ ' canceled the game '+game.gameName+'.');
            });

            /////////////////////////////////////////////////////////////////////////////

            socket.on('start_game', (game) => {

                this.io.to(game._id).emit('start_game', game);
                //for(0 a 3)
                //this.io.to(game.players[i].clindid).emit('start_game', game.dacartas());
                //loop sock
                //  socket.on('dar cartas', darbarCartas
                //console.log(game);
            });

            ////////////////////////////////////////////////////////////////////////////
        });
    };

    public notifyAll = (channel: string, message: string) => {
        this.io.sockets.emit(channel, message);
    }; 
}

