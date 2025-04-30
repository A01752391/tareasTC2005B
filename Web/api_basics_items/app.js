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

let users = [
    { "id": 1, "username": "user1", "items": [1] },
    { "id": 2, "username": "user2", "items": [2] }
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

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

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
    })
});
