import type { Game } from "@/types/Game";
import AbstractRepository from "./AbstractRepository";

export default class GameRepository extends AbstractRepository<Game>{
    public async *getIds(): AsyncGenerator<string> {
        const limit = 500;
        let offset = 0;
        let result;
    
        do {
            result = await this.storage
                .limit(limit)
                .offset(offset)
                .get();
    
            for (let game of result.items) {
                yield game.id;
            }
            
            offset += limit;
        } while (result.qty === limit);
    }
}