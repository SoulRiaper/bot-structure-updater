import { Db, MongoClient, ObjectId } from "mongodb";
import { Item, ItemToSave, StoredTypes, isItem } from "./IItems";

export class MongoDbClient {
    private url: string;
    private client: MongoClient;
    private db!: Db;
    constructor () {
        // TODO: load from options or system environment
        this.url = 'mongodb://localhost:27017';
        this.client = new MongoClient(this.url);
    }

    public async init () {
        await this.client.connect();
        this.db = this.client.db("main");
    }

    public async saveEmbedded (itemToSave: Item): Promise<ObjectId> {
        const saveThis :ItemToSave = { type: itemToSave.type, title: itemToSave.title, searchOrigin: itemToSave.searchOrigin, hasItem: new Array<ObjectId>}
        const collection = this.db.collection('user-things');
        if (saveThis.type == StoredTypes.ITEM) {
            return (await collection.insertOne(itemToSave)).insertedId;
        }
        else {
            const embeddedItems = itemToSave.hasItem;
            let uris: Array<ObjectId> = [];
            for (const item of embeddedItems) {
                if (isItem(item)) {
                    const uri = await this.saveEmbedded(item)
                    uris.push(uri);
                }
            }
            saveThis.hasItem = uris;
            return (await collection.insertOne(saveThis)).insertedId;
        }
    }

    public async destruct () {
        await this.client.close();
    }
}
