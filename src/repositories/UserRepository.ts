import type { User } from "@/types/User";
import AbstractRepository from "./AbstractRepository";

export default class UserRepository extends AbstractRepository<User> {
    public async getIds(): Promise<string[]> {
        return (await this.storage.limit(Infinity).get())
            .items
            .map(user => user.id);
    }
}