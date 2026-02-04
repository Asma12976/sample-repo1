document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchInput');
    const noContacts = document.getElementById('noContacts');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const contactIdInput = document.getElementById('contactId');

    // Load contacts from localStorage
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Render contacts
    function renderContacts(filter = '') {
        contactList.innerHTML = '';
        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(filter.toLowerCase()) ||
            contact.email.toLowerCase().includes(filter.toLowerCase()) ||
            contact.phone.includes(filter)
        );

        if (filteredContacts.length === 0) {
            noContacts.classList.remove('d-none');
        } else {
            noContacts.classList.add('d-none');
            filteredContacts.forEach(contact => {
                const tr = document.createElement('tr');
                tr.className = 'fade-in';
                tr.innerHTML = `
                    <td>
                        <div class="contact-name">${contact.name}</div>
                    </td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2 btn-action" onclick="editContact('${contact.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteContact('${contact.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                contactList.appendChild(tr);
            });
        }
    }

    // Save contacts to localStorage
    function saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts(searchInput.value);
    }

    // Add/Update Contact
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const id = contactIdInput.value;

        if (id) {
            // Update existing
            const index = contacts.findIndex(c => c.id === id);
            contacts[index] = { ...contacts[index], name, email, phone };
            resetForm();
        } else {
            // Add new
            const newContact = {
                id: Date.now().toString(),
                name,
                email,
                phone
            };
            contacts.push(newContact);
            contactForm.reset();
        }

        saveContacts();
    });

    // Edit Contact
    window.editContact = (id) => {
        const contact = contacts.find(c => c.id === id);
        if (contact) {
            document.getElementById('name').value = contact.name;
            document.getElementById('email').value = contact.email;
            document.getElementById('phone').value = contact.phone;
            contactIdInput.value = contact.id;
            
            formTitle.textContent = 'Edit Contact';
            submitBtn.textContent = 'Update Contact';
            cancelBtn.classList.remove('d-none');
            
            // Scroll to form on mobile
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Delete Contact
    window.deleteContact = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            contacts = contacts.filter(c => c.id !== id);
            saveContacts();
        }
    };

    // Cancel Edit
    cancelBtn.addEventListener('click', () => {
        resetForm();
    });

    function resetForm() {
        contactForm.reset();
        contactIdInput.value = '';
        formTitle.textContent = 'Add New Contact';
        submitBtn.textContent = 'Save Contact';
        cancelBtn.classList.add('d-none');
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderContacts(e.target.value);
    });

    // Initial render
    renderContacts();
});
