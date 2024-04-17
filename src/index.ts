import * as marked from 'marked';
import { readFile, readdir, writeFileSync } from 'fs';

interface LinkArray {
    [key : string]: Array<Link>
}

interface Link {
    href: string,
    description: string
}

const renderer = new marked.Renderer();
let currentHeader = "";
let links: LinkArray = {};

renderer.heading = function (text , level) {
    if (text != "Index") {
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

        links[currentHeader].push({href, description: text? text : "ресурс"})
    }
    return "";
}

readFile('file.md', (err, data) => {
    if (err) {
        console.log(err.message);
        return;
    }
    marked.marked(data.toString(), {renderer})
    console.log(links);
})

