let contacts = [];
let editingId = null;

async function loadContacts() {
    try {
        const response = await fetch("/contacts");
        contacts = await response.json();

        if (!Array.isArray(contacts)) {
            contacts = [];
        }

        displayContacts(contacts);
        document.getElementById("totalContacts").textContent = contacts.length;

    } catch (error) {
        showMessage("Unable to load contacts", true);
    }
}

function displayContacts(data) {
    const tableBody = document.getElementById("contactsTableBody");

    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No contacts found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(contact => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(contact.contactId)}</td>
            <td>${escapeHtml(contact.name)}</td>
            <td>${escapeHtml(contact.phone)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>
                <button class="edit-btn" onclick="editContact('${contact._id}')">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteContact('${contact._id}')">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

document.getElementById("contactForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const contactId = document.getElementById("contactId").value.trim();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const contactData = {
        contactId,
        name,
        phone,
        email
    };

    try {

        let response;

        if (editingId) {

            response = await fetch(`/contacts/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });

        } else {

            response = await fetch("/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });
        }

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.error || result.message || "Operation failed", true);
            return;
        }

        showMessage(
            editingId
                ? "Contact updated successfully"
                : "Contact added successfully"
        );

        cancelEdit();
        loadContacts();

    } catch (error) {
        showMessage("Something went wrong", true);
    }
});

function editContact(id) {

    const contact = contacts.find(item => item._id === id);

    if (!contact) {
        return;
    }

    editingId = id;

    document.getElementById("contactId").value = contact.contactId;
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;

    document.getElementById("submitBtn").textContent = "Update Contact";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteContact(id) {

    const confirmDelete = confirm("Are you sure you want to delete this contact?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/contacts/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message || "Delete failed", true);
            return;
        }

        showMessage("Contact deleted successfully");

        loadContacts();

    } catch (error) {
        showMessage("Unable to delete contact", true);
    }
}

function cancelEdit() {

    editingId = null;

    document.getElementById("contactForm").reset();

    document.getElementById("submitBtn").textContent = "Add Contact";
}

function searchContacts() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filteredContacts = contacts.filter(contact =>

        contact.contactId.toLowerCase().includes(searchValue) ||
        contact.name.toLowerCase().includes(searchValue) ||
        contact.phone.includes(searchValue) ||
        contact.email.toLowerCase().includes(searchValue)

    );

    displayContacts(filteredContacts);
}

function showMessage(message, error = false) {

    const messageElement = document.getElementById("message");

    messageElement.textContent = message;

    messageElement.style.color = error ? "#dc2626" : "#16a34a";

    setTimeout(() => {
        messageElement.textContent = "";
    }, 3000);
}

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

loadContacts();