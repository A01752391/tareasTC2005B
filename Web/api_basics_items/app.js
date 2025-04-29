"use strict";

import express from "express";
import fs from 'fs';

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))


let catalog = [
    { id: 1, name: "Sword", type: "Weapon", effect: "Deals damage" },
    { id: 2, name: "Shield", type: "Defense", effect: "Blocks attacks" }
];

app.get('/items', (req, res) => {
    res.json(catalog);
});

app.get('/obtainItems', (req, res) => {
    fs.readFile('./public/html/helloServer.html', 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send('There was an error reading the HTML: ' + err);
        }

        res.send(html);
    });
});

app.listen(port, ()=>{
    console.log(`Servidor en http://localhost:${port}`)
})