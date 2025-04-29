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

let users = [];

app.post('/users/register', (req, res) => {
    const newUser = req.body;

    const requiredFields = ['id', 'username', 'items']; 
    for (const field of requiredFields) {
        if (!newUser.hasOwnProperty(field)) {
            return res.status(400).json({ message: `Missing field: ${field}` });
        }
    }

    const existingUser = users.find(u => u.id === newUser.id || u.username === newUser.username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const invalidItemIds = newUser.items.filter(itemId => 
        !catalog.find(catalogItem => catalogItem.id === itemId)
    );

    if (invalidItemIds.length > 0) {
        return res.status(400).json({ message: `Invalid item IDs: ${invalidItemIds.join(', ')}` });
    }

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
});


app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});