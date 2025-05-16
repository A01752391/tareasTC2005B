const resultBox = document.getElementById('api_result');

async function showResult(message, isError = false) {
    resultBox.textContent = message;
    if (isError) {
        resultBox.style.color = 'red';
    } else {
        resultBox.style.color = 'black';
    }
    console.log(isError ? 'Error:' : 'Success:', message);
}

async function loadPage(){
    console.log('Página cargada con éxito');
    showResult('Page loaded!!');
}

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
        showResult('Item added');
    } catch (error) {
        console.error('Error adding item:', error);
        showResult('Error adding item: ' + error.message, true);
    }
}

async function obtainItems() {
    const resultBox = document.getElementById('api_result');

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

        const itemsDetails = items.map(item => 
            `ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Effect: ${item.effect}`
        ).join('\n\n');
        
        showResult(`Items:\n${itemsDetails}`);

    } catch (error) {
        console.error('Error fetching items:', error);
        showResult('Error fetching items: ' + error.message, true);
    }
}

async function obtainItemsID(id) {
    const response = await fetch(`http://localhost:7500/items/${id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(result.message);
        showResult(`Error obtaining item: ${error.message}`, true);
        return;
    }
    
    const itemDetails = `ID ${result.id}, Name: ${result.name}, Type: ${result.type}, Effect: ${result.effect}`;
        
    showResult(`Item:\n${itemDetails}`);

    console.log(result);
}

async function deleteItem(id) {
    try {
        const response = await fetch(`http://localhost:7500/items/delete/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        console.log(result.message);
        
        showResult(`Items ${id} deleted`);
    } catch (error) {
        console.error('Error deleting item:', error);
        showResult(`Error deleting item: ${error.message}`, true);
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

        const itemDetails = `ID ${result.id}, Name: ${result.name}, Type: ${result.type}, Effect: ${result.effect}`;
        showResult(`Item updated:\n${itemDetails}`);
    } catch (error) {
        console.error('Error updating item:', error);
        showResult(`Error updating item: ${error.message}`, true);
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
            showResult(`User added`);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showResult(`Error adding user: ${error.message}`, true);
    }
}

async function obtainUsers() {
    try {
        const response = await fetch('http://localhost:7500/users');
        const data = await response.json();

        const usersList = users.map(user => 
            `ID: ${user.id}, Name: ${user.username}, Items: ${user.items?.length || 0}`
        ).join('\n\n');
        
        showResult(`Usuarios:\n${usersList}`);

        console.log('Users:', data);

        const usersDetails = users.map(user => 
            `ID: ${user.id}, Nombre: ${user.nombre}, Email: ${user.email}, Items: ${user.items?.length || 0}`
        ).join('\n\n');
        
        showResult(`Users:\n${usersDetails}`);
    } catch (error) {
        console.error('Error fetching users:', error);
        showResult('Error fetching users: ' + error.message, true);
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
            showResult(`Error: ${errorData.message}`, true);
            return;
        }
        
        console.log('User details:', result);
         const itemsList = user.items?.map(item => 
            `- ${item.name} (${item.type})`
        ).join('\n') || 'No items';

        const userDetails = `ID: ${user.id}, Nombre: ${user.nombre}, Email: ${user.email}\nItems:\n${itemsList}`;
        
        showResult(`User:\n${userDetails}`);
        
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

async function main() {
    const buttonLoadPage = document.getElementById("paginaCreada");
    const buttonNewItem = document.getElementById("newItem");
    const buttonObtainItems = document.getElementById("obtainItems");
    const buttonObtainItemsID = document.getElementById("obtainItemsID");

    buttonLoadPage.addEventListener('click', loadPage);
    buttonNewItem.addEventListener('click', newItem);
    buttonObtainItems.addEventListener('click', obtainItems);
    buttonObtainItemsID.addEventListener('click', obtainItemsID);
    
}

main();