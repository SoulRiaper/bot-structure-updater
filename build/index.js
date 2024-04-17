"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const marked = __importStar(require("marked"));
const fs_1 = require("fs");
const renderer = new marked.Renderer();
let currentHeader = "";
let links = {};
renderer.heading = function (text, level) {
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
};
renderer.link = function (href, title, text) {
    if (currentHeader) {
        links[currentHeader].push({ href, description: text ? text : "ресурс" });
    }
    return "";
};
(0, fs_1.readFile)('file.md', (err, data) => {
    if (err) {
        console.log(err.message);
        return;
    }
    marked.marked(data.toString(), { renderer });
    console.log(links);
});
