async function loadPage(){
    console.log('Página cargada con éxito');
}

loadPage();

async function newItem(){
    const data = {
        id: 1,
        name: "Sword",
        type: "Weapon",
        effect: "Deals damage"
    };

    try {
        const response = await fetch('http://localhost:7500/newItems', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

async function obtainItems() {
    try {
        const response = await fetch('http://localhost:7500/items', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            return;
        }

        const items = await response.json();
        console.log('Items:', items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`http://localhost:7500/items/delete/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

async function updateItem(id, updates) {
    try {
        const response = await fetch(`http://localhost:7500/items/update/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();
        console.log(result.message);
        console.log(result.item);
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

// Funciones para usuarios
async function addUser(userData) {
    try {
        const response = await fetch('http://localhost:7500/users/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log(result.message);
        if (result.user) {
            console.log('User added:', result.user);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function obtainUsers() {
    try {
        const response = await fetch('http://localhost:7500/users');
        const data = await response.json();
        console.log('Users:', data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function getUserID(id) {
    try {
        const response = await fetch(`http://localhost:7500/users/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error:', result.message);
            if (document.getElementById('errorMessage')) {
                document.getElementById('errorMessage').innerText = result.message;
            }
            return;
        }
        
        console.log('User details:', result);
        if (document.getElementById('userDetails')) {
            document.getElementById('userDetails').innerText = 
                `ID: ${result.id}, Nombre: ${result.username}, Items: ${result.items.map(i => i.name).join(", ")}`;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

async function deleteUserID(id) {
    try {
        const response = await fetch(`http://localhost:7500/users/delete/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error:', result.message);
            if (document.getElementById('errorMessage')) {
                document.getElementById('errorMessage').innerText = result.message;
            }
            return;
        }

        console.log(result.message);
        if (document.getElementById('userDeleted')) {
            document.getElementById('userDeleted').innerText = `Usuario eliminado: ${result.user.username}`;
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function updateUserID(id, updates) {
    try {
        const response = await fetch(`http://localhost:7500/users/update/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error:', result.message);
            if (document.getElementById('errorMessage')) {
                document.getElementById('errorMessage').innerText = result.message;
            }
            return;
        }

        console.log(result.message);
        console.log('Updated user:', result.user);
        if (document.getElementById('userDetails')) {
            document.getElementById('userDetails').innerText = `Actualizado: ${result.user.username}`;
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}
