"use strict";

import express from "express";
import fs from 'fs';

const port = 7500;
const app = express();
app.use(express.json());
app.use(express.static('./public'));

let catalog = [
    { "id": 1, "name": "Sword", "type": "Weapon", "effect": "Deals damage" },
    { "id": 2, "name": "Shield", "type": "Defense", "effect": "Blocks attacks" }
];

let users = [
    { "id": 1, "username": "user1", "email": "prueba1@gmail.com", "items": [1] },
    { "id": 2, "username": "user2", "email": "prueba2@gmail.com", "items": [2] }
];

// Cargar página
app.get('/', (req, res) => {
    fs.readFile('./public/html/helloServer.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('There was an error: ' + err);
            return;
        }
        console.log("Sending page...");
        res.send(html);
        console.log("Page sent!");
    });
});

// Obtener todos los items
app.get('/items', (req, res) => {
    if (catalog.length === 0) {
        return res.status(404).json({ message: 'No items registered' });
    }
    res.json(catalog);
});

// Agregar items
app.post('/newItems', (req, res) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const addedItems = [];

    for (const item of newItems) {
        const { id, name, type, effect } = item;

        if (!id || !name || !type || !effect) {
            return res.status(400).json({ message: 'Missing required fields: id, name, type, effect' });
        }

        if (catalog.find(i => i.id === id)) {
            return res.status(409).json({ message: `Item with ID ${id} already exists` });
        }

        catalog.push(item);
        addedItems.push(item);
    }

    res.status(201).json({ 
        message: 'Items added successfully', 
        itemsAdded: addedItems.length,
        items: addedItems
    });
});

// Obtener items por ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    const item = catalog.find(item => item.id === parseInt(id));

    if (!item) {
        return res.status(404).json({ message: `Item with ID ${id} not found` });
    }

    res.json(item);
});


// Borrar items por ID
app.delete('/items/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = catalog.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: `Item with ID ${id} not found` });
    }

    const deletedItem = catalog.splice(index, 1);
    res.json({ 
        message: `Item with ID ${id} deleted successfully`,
        item: deletedItem[0]
    });
});

// Modificación de items
app.patch('/items/update/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const item = catalog.find(item => item.id === parseInt(id));

    if (!item) {
        return res.status(404).json({ message: `Item with ID ${id} not found` });
    }

    const validFields = ['name', 'type', 'effect'];
    for (const key in updates) {
        if (validFields.includes(key)) {
            item[key] = updates[key];
        }
    }

    res.json({ 
        message: `Item with ID ${id} updated successfully`,
        item
    });
});

// Registro de usuarios
app.post('/users/register', (req, res) => {
    const newUser = req.body;

    const requiredFields = ['id', 'username', 'email', 'items'];
    for (const field of requiredFields) {
        if (!newUser[field]) {
            return res.status(400).json({ message: `Missing required field: ${field}` });
        }
    }

    const existingUser = users.find(u => 
        u.id === newUser.id || u.username === newUser.username || u.email === newUser.email
    );
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const invalidItemIds = newUser.items.filter(itemId => 
        !catalog.find(item => item.id === itemId)
    );
    if (invalidItemIds.length > 0) {
        return res.status(400).json({ 
            message: `Invalid item IDs: ${invalidItemIds.join(', ')}`,
            validItems: catalog.map(item => item.id)
        });
    }

    users.push(newUser);
    res.status(201).json({ 
        message: 'User registered successfully',
        user: newUser
    });
});

// Obtener todos los usuarios
app.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: 'No users registered' });
    }

    const usersWithItems = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        items: user.items
            .map(itemId => catalog.find(item => item.id === itemId))
            .filter(item => item)
    }));

    res.json(usersWithItems);
});

// Obtener usuarios por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const userWithItems = {
        id: user.id,
        username: user.username,
        email: user.email,
        items: user.items
            .map(itemId => catalog.find(item => item.id === itemId))
            .filter(item => item)
    };

    res.json(userWithItems);
});

// Borrar usuarios por ID
app.delete('/users/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const deletedUser = users.splice(index, 1)[0];
    res.json({
        message: `User with ID ${id} deleted successfully`,
        user: deletedUser
    });
});

// Modificar usuarios por ID
app.patch('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    if (updates.username) user.username = updates.username;
    if (updates.email) user.email = updates.email;

    if (updates.items) {
        const invalidItems = updates.items.filter(itemId => 
            !catalog.find(item => item.id === itemId)
        );
        if (invalidItems.length > 0) {
            return res.status(400).json({
                message: `Invalid item IDs: ${invalidItems.join(', ')}`,
                validItems: catalog.map(item => item.id)
            });
        }
        user.items = updates.items;
    }

    res.json({
        message: `User with ID ${id} updated successfully`,
        user
    });
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});