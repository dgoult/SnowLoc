import { StorageServiceBase } from '@/services/base/storageServiceBase';
import localForage from 'localforage';

export class LocalStorageService extends StorageServiceBase {
    protected store: LocalForage;

    public constructor() {
        super('local');

        this.store = localForage
            .createInstance({
                name: this.storeName
            });
    }

    public async get<T>(key: string): Promise<T | null> {
        return await this.store.getItem(key);
    }

    public async set<T>(key: string, value: T | null): Promise<void> {
        await this.store.setItem(key, value);
    }
}