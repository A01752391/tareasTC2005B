"use strict";

import express from "express";
import fs from 'fs';

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))


let catalog = [];

app.get('/items', (req, res) => {
    if (catalog.length === 0) {
        return res.status(200).json({ message: 'No hay items disponibles' });
    }
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