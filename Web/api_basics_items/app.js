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