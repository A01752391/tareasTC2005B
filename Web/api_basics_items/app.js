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

// Add items
app.get('/items', (req, res) => {
    if (catalog.length === 0) {
        return res.status(200).json({ message: 'No item registered' });
    }
    res.json(catalog); 
});

// Obtain items
app.get('/obtainItems', (req, res) => {
    fs.readFile('./public/html/helloServer.html', 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send('There was an error reading the HTML: ' + err);
        }

        res.send(html);
    });
});

// New Items
app.post('/newItems', (req, res) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const addedItems = [];

    for (const item of newItems) {
        const { id, name, type, effect } = item;

        if (!id || !name || !type || !effect) {
            return res.status(400).json({ message: 'Missing fields to add items' });
        }

        if (catalog.find(i => i.id === id)) {
            return res.status(409).json({ message: `Item with ID ${id} already exists` });
        }

        catalog.push(item);
        addedItems.push(item);
    }

    res.status(201).json({ message: 'Items added', items: addedItems });
});

// Get item by ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params; 
    const item = catalog.find(item => item.id === parseInt(id));

    if (!item) {
        return res.status(200).json({ message: `Item with ID ${id} was not found` });
    }

    res.json(item);
});

// Delete item by ID
app.delete('/items/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = catalog.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
        return res.status(200).json({ message: `Item with ID ${id} was not found` });
    }

    const deletedItem = catalog.splice(index, 1);
    res.status(200).json({ message: `Item with ID ${id} was deleted`, item: deletedItem[0] });
});

// Update item by ID
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

// Add user
app.post('/users/register', (req, res) => {
    const newUser = req.body;

    const requiredFields = ['id', 'username', 'email', 'items']; 
    for (const field of requiredFields) {
        if (!newUser.hasOwnProperty(field)) {
            return res.status(400).json({ message: `Missing field: ${field}` });
        }
    }

    const existingUser = users.find(u => 
        u.id === newUser.id || u.username === newUser.username || u.email === newUser.email
    );
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

// Obtain users
app.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(200).json({ message: 'No users registered' });
    }

    const usersWithItems = users.map(user => {
        let userWithItemsDetails = {
            id: user.id,
            username: user.username,
            email: user.email,
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

// Obtain users by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} was not found` });
    }

    const userWithItems = {
        id: user.id,
        username: user.username,
        email: user.email,
        items: user.items
            .map(itemId => catalog.find(item => item.id === itemId))
            .filter(item => item) 
    };

    res.status(200).json(userWithItems);
});

// Delete users by ID
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

// Update user by ID
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

// Server on
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});