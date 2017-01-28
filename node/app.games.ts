const mongodb = require('mongodb');
const util = require('util');
import {HandlerSettings} from './handler.settings';
import {databaseConnection as database} from './app.database';

export class Game {

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    };

    private returnGame = (id:string, response: any, next: any) => {
        database.db.collection('games')
            .findOne({
                _id: id
            })
            .then(game => {
                if (game === null) {
                    response.send(404, 'Game not found');
                } else {
                    response.json(game);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    };

    public getGames = (request: any, response: any, next: any) => {
        database.db.collection('games')
            .find()
            .toArray()
            .then(games => {
                response.json(games || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    };

    public getGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        this.returnGame(id, response, next);
    };

    public updateGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const game = request.body;

        if (game === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        delete game._id;
        database.db.collection('games')
            .updateOne({
                _id: id
            }, {
                $set: game
            })
            .then(result => this.returnGame(id, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public createGame =  (request: any, response: any, next: any) => {
        var game = request.body;
        if (game === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .insertOne(game)
            .then(result => this.returnGame(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public deleteGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        database.db.collection('games')
            .deleteOne({
                _id: id
            })
            .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Game -%s- Deleted', id)
                    });
                } else {
                    response.send(404, 'No game found');
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    };

    public getMyGames = (request: any, response: any, next: any) => {
        const user_id = request.params.id;

        database.db.collection('games')
            .find({creatorId:user_id, state:'pending'})
            .toArray()
            .then(games => {
                response.json(games || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    };

    public joinGame = (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const newPlayer = request.body;

        if (id === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .updateOne({
                _id: id
            }, {
                $push: {players : newPlayer}
            })
            .then(result => this.returnGame(id, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public cancelGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);

        if (id === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .updateOne({
                _id: id
            }, {
                $set: {state: 'canceled'}
            })
            .then(result => this.returnGame(id, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public updateStateGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);

        let time = new Date();
        let dformat = [time.getDate(),
                time.getMonth()+1,
                time.getFullYear()].join('/')+' '+
            [time.getHours(),
                time.getMinutes(),
                time.getSeconds()].join(':');
        if (id === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .updateOne({
                _id: id
            }, { $set: {state : 'playing' , gameStart : dformat }})
            .then(result => this.returnGame(id, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public updateGameScore =  (request: any, response: any, next: any) => {
        const gameId = new mongodb.ObjectID(request.params.gameId);
        const userId = request.params.userId;

        if (gameId === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .updateOne({
                _id: gameId, "players.player": userId
            }, { $set: { "players.$.score": request.body.score }})
            .then(result => this.returnGame(gameId, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public updateGameVictory =  (request: any, response: any, next: any) => {
        const gameId = new mongodb.ObjectID(request.params.gameId);
        const userId = request.params.userId;

        let time = new Date();
        let dformat = [time.getDate(),
                time.getMonth()+1,
                time.getFullYear()].join('/')+' '+
            [time.getHours(),
                time.getMinutes(),
                time.getSeconds()].join(':');

        if (gameId === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        database.db.collection('games')
            .updateOne({
                _id: gameId, "players.player": userId
            }, { $set: {
                state: 'ended',
                winner: request.body.username,
                gameEnd: dformat,
                "players.$.score": request.body.score
            }
            })
            .then(result => this.returnGame(gameId, response, next))
            .catch(err => this.handleError(err, response, next));
    };

    public getPlayedGames = (request: any, response: any, next: any) => {
        database.db.collection('games')
            .find({$or:[{state:'ended'},{state:'playing'}]})
            .toArray()
            .then(games => {
                response.json(games || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    };

    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        server.get(settings.prefix + 'games', this.getGames);
        server.get(settings.prefix + 'history', this.getPlayedGames);
        server.get(settings.prefix + 'games/:id', settings.security.authorize, this.getGame);
        server.get(settings.prefix + 'mygames/:id',settings.security.authorize, this.getMyGames);
        server.post(settings.prefix + 'games', settings.security.authorize, this.createGame);
        server.put(settings.prefix + 'joingame/:id',settings.security.authorize, this.joinGame);
        server.put(settings.prefix + 'games/:id/cancel', settings.security.authorize, this.cancelGame);
        server.put(settings.prefix + 'games/:gameId/updatescore/:userId',settings.security.authorize, this.updateGameScore);
        server.put(settings.prefix + 'games/:gameId/updatevictory/:userId',settings.security.authorize, this.updateGameVictory);
        server.put(settings.prefix + 'gamestate/:id', settings.security.authorize, this.updateStateGame);
        server.put(settings.prefix + 'games/:id', settings.security.authorize, this.updateGame);
        server.del(settings.prefix + 'games/:id', settings.security.authorize, this.deleteGame);
        console.log("Games routes registered");
    };
}