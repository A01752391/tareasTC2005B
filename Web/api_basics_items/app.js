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

app.patch('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} was not found` });
    }

    if (updates.username !== undefined) user.username = updates.username;
    if (updates.email !== undefined) user.email = updates.email;
    
    if (updates.items !== undefined) user.items = updates.items;

    res.status(200).json({
        message: `User with ID ${id} was updated`,
        user
    });
});


app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
