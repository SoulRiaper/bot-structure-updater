import * as marked from 'marked';
import { readFile, readdir, writeFileSync } from 'fs';
import { LinkArray, Item, SearchOrigins, StoredTypes } from './IItems';
import { MongoDbClient } from './MongoClient';
import { ObjectId } from 'mongodb';

const renderer = new marked.Renderer();
let currentHeader = "";
let links: LinkArray = {};

renderer.heading = function (text , level) {
    if (text != "Index" && text != "BY SUBJECT") {
        if (text.indexOf("C++") != -1) {
            currentHeader = "C++";
            links[currentHeader] = [];
            return "";
        }
        if (text.indexOf("C#") != -1) {
            currentHeader = "C#";
            links[currentHeader] = [];
            return "";
        }
        currentHeader = text;
        links[currentHeader] = [];
    }
    
    return "";
}

renderer.link = function (href, title, text) {
    if (currentHeader) {

        links[currentHeader].push({
            type: StoredTypes.ITEM,
            searchOrigin: SearchOrigins.LANG,
            title: text? text: "***",
            hasItem: href
        })
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
    marked.marked(data.toString(), {renderer})
    let toSave: Array<Item> = [];
    for (const folder in links) {
        toSave.push({
            title: folder,
            searchOrigin: SearchOrigins.LANG,
            type: StoredTypes.FOLDER,
            hasItem: links[folder]
        })
    }
    console.log(JSON.stringify(toSave, null, 2));
    const main: Item = {
        hasItem: toSave,
        searchOrigin: SearchOrigins.LANG,
        title: "MAIN",
        type: StoredTypes.FOLDER
    }
    mdb.saveEmbedded(main).then((id) => {
        console.log(id);
        mdb.destruct().then(console.log);
    });
})