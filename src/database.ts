import {Connection, Database} from 'simple-wrap-indexed-db';

export enum Storages {
    Games = `users-games`,
    Users = `users`,
}

const config = {
    name: `dota2`,
    storages: [
        {
            name: Storages.Games
        },
        {
            name: Storages.Users
        },
    ]
};

const connection = await Connection.create(config.name, config.storages);
export default  new Database(connection);