import { ObjectId } from "mongodb";

export interface LinkArray {
    [key : string]: Array<Item>
}

export interface Item {
    type: StoredTypes,
    title: string,
    searchOrigin: SearchOrigins,
    hasItem: Array<Item> | string | Array<ObjectId>
}

export function isItem(item: any): item is Item {
    return 'type' in item;
}

export enum StoredTypes{
    FOLDER = "folder",
    ITEM = "item"
}

export enum SearchOrigins {
    LANG = "lang"
}