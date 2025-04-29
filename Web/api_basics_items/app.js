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

app.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(200).json({ message: 'No users registered' });
    }

    const usersWithItems = users.map(user => {
        let userWithItemsDetails = {
            id: user.id,
            username: user.username,
            items: []
        };

        // Mapear los items con sus detalles
        user.items.forEach(itemId => {
            const item = catalog.find(catalogItem => catalogItem.id === itemId);
            if (item) {
                userWithItemsDetails.items.push(item);
            }
        });

        return userWithItemsDetails;
    });

    res.status(200).json(usersWithItems);
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});