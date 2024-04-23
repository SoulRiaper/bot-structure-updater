import { ObjectId } from "mongodb";


export interface Item {
    type: StoredTypes,
    title: string,
    searchOrigin: SearchOrigins,
    hasItem: Array<Item> | string,

}

export interface ItemToSave {
    type: StoredTypes,
    title: string,
    searchOrigin: SearchOrigins,
    hasItem: Array<ObjectId> | string,
}

export function isItem(item: any): item is Item {
    return 'type' in item;
}

export enum StoredTypes{
    FOLDER = "folder",
    ITEM = "item"
}

export enum SearchOrigins {
    LANG = "lang",
    SUBJECT = "subject"
}