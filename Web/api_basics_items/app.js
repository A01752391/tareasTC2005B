"use strict";

import express from "express";

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))

let catalog = [];
app.post('/newitems', (req, res) => {
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