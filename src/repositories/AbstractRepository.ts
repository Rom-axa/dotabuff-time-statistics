import type DatabaseStorageInterface from "simple-wrap-indexed-db/dist/Contracts/DatabaseStorageInterface";

export default abstract class AbstractRepository<T = object> {
    constructor(
        protected readonly storage: DatabaseStorageInterface<T>,
    ) {
    }

    public async save(entity: T | T[]): Promise<void>
    {
        entity instanceof Array
            ? await (this.storage.insertBatch(entity))
            : await (this.storage.insert(entity));
    }
}