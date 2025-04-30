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

let users = [
    { "id": 1, "username": "user1", "items": [1] },
    { "id": 2, "username": "user2", "items": [2] }
];

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} was not found` });
    }

    const userWithItems = {
        id: user.id,
        username: user.username,
        app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} was not found` });
    }

    const userWithItems = {
        id: user.id,
        username: user.username,
        items: user.items
            .map(itemId => catalog.find(item => item.id === itemId))
            .filter(item => item) 
    };

    res.status(200).json(userWithItems);
});

        items: user.items
            .map(itemId => catalog.find(item => item.id === itemId))
            .filter(item => item) 
    };

    res.status(200).json(userWithItems);
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
