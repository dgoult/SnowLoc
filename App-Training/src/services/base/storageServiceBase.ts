export abstract class StorageServiceBase {
    protected storeName: string;

    protected constructor(storeName: string) {
        this.storeName = storeName;
    }
}