"use strict";

import express from "express";
import fs from 'fs';

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))

let catalog = [
    { "id": 1, "name": "Sword", "type": "Weapon", "effect": "Deals damage" },
    { "id": 2, "name": "Shield", "type": "Defense", "effect": "Blocks attacks" }
];

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


app.get('/items/:id', (req, res) => {
    const { id } = req.params; 
    const item = catalog.find(item => item.id === parseInt(id));

    if (!item) {
        return res.status(200).json({ message: `Item with ID ${id} was not found` });
    }

    res.json(item);
});

app.delete('/items/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = catalog.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
        return res.status(200).json({ message: `Item with ID ${id} was not found` });
    }

    const deletedItem = catalog.splice(index, 1);
    res.status(200).json({ message: `Item with ID ${id} was deleted`, item: deletedItem[0] });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
