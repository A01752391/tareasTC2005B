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

app.delete('/users/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: `User with ID ${id} was not found` });
    }

    const deletedUser = users.splice(index, 1)[0];

    res.status(200).json({
        message: `User with ID ${id} was deleted`,
        user: deletedUser
    });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});