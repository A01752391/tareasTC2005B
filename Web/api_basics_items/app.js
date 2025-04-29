"use strict";

import express from "express";

const port = 7500;

const app = express()

app.use(express.json())

app.use(express.static('./public'))


let catalog = [
    { "id": 1, "name": "Sword", "type": "Weapon", "effect": "Deals damage" },
    { "id": 2, "name": "Shield", "type": "Defense", "effect": "Blocks attacks" }
];

app.patch('/items/update/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const item = catalog.find(item => item.id === parseInt(id));

    if (!item) {
        return res.status(200).json({ message: `Item with ID ${id} was not found` });
    }

    for (let key in updates) {
        if (item.hasOwnProperty(key)) {
            item[key] = updates[key];
        }
    }

    res.status(200).json({ message: `Item with ID ${id} was updated`, item });
});


app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});