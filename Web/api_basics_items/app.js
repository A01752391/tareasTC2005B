"use strict";

import express from "express";
<<<<<<< HEAD
=======
import fs from 'fs';
>>>>>>> obtain-items

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))

<<<<<<< HEAD
let catalog = [];
app.post('/newItems', (req, res) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const addedItems = [];

    for (const item of newItems) {
        const { id, name, type, effect } = item;

        if (!id || !name || !type || !effect) {
            return res.status(400).json({ message: 'Faltan atributos en algún item' });
        }

        if (catalog.find(i => i.id === id)) {
            return res.status(409).json({ message: `El item con ID ${id} ya existe` });
        }

        catalog.push(item);
        addedItems.push(item);
    }

    res.status(201).json({ message: 'Items agregados', items: addedItems });
});

=======

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
>>>>>>> obtain-items

app.listen(port, ()=>{
    console.log(`Servidor en http://localhost:${port}`)
})