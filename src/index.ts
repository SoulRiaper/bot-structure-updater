import * as marked from 'marked';
import { readFile, readdir, writeFileSync } from 'fs';
import { isItem, Item, SearchOrigins, StoredTypes } from './IItems';
import { MongoDbClient } from './MongoClient';
import { ObjectId } from 'mongodb';

const renderer = new marked.Renderer();
let links: Array<Item> = [];
let currentItem: Item;
let currentSubItem: Item | null;
let origin: SearchOrigins = SearchOrigins.LANG;

renderer.heading = function (text , level) {
    if (level == 3) {
        if (text != "Index" ) {
            if (text.indexOf("C++") != -1) {
                const index = links.push({title: "C++", type: StoredTypes.FOLDER, searchOrigin: origin, hasItem: new Array<Item>});
                currentItem = links[index - 1];
                currentSubItem = null;

                return "";
            }
            if (text.indexOf("C#") != -1) {
                const index = links.push({title: "C#", type: StoredTypes.FOLDER, searchOrigin: origin, hasItem: new Array<Item>});
                currentItem = links[index - 1]
                currentSubItem = null;

                return "";
            }
            const index = links.push({title: text, type: StoredTypes.FOLDER, searchOrigin: origin, hasItem: new Array<Item>});
            currentItem = links[index - 1];
            currentSubItem = null;
        }
    }
    if (level == 4 ) {
        if (currentItem) {
            if (currentItem.hasItem instanceof Array){
                const index = currentItem.hasItem.push({title: text, searchOrigin: origin, type: StoredTypes.FOLDER, hasItem: new Array<Item>})
                currentSubItem = currentItem.hasItem[index - 1];
            }
        }        
    }
    
    return "";
}

renderer.link = function (href, title, text) {
    if (currentItem) {
        if (currentSubItem) {
            if (currentSubItem.hasItem instanceof Array){
                currentSubItem.hasItem.push(
                    {
                        type: StoredTypes.ITEM,
                        searchOrigin: origin,
                        title: text? text: "***",
                        hasItem: href
                    }
                );
                return "";
            }
        }
        if (currentItem.hasItem instanceof Array) {
            currentItem.hasItem.push(
                {
                    type: StoredTypes.ITEM,
                    searchOrigin: origin,
                    title: text? text: "***",
                    hasItem: href
                }
            );
        }
    }
    return "";
}

const mdb = new MongoDbClient();
mdb.init().then(console.log);

readFile('file.md', (err, data) => {
    if (err) {
        console.log(err.message);
        return;
    }
    marked.marked(data.toString(), {renderer});
    console.log(JSON.stringify(links, null, 2));
    const main: Item = {
        hasItem: links,
        searchOrigin: SearchOrigins.LANG,
        title: "MAIN",
        type: StoredTypes.FOLDER
    }
    mdb.saveEmbedded(main).then((id) => {
        console.log(id);
        mdb.destruct().then(console.log);
    });
})