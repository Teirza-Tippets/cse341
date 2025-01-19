const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// all contacts
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const contactsCollection = db.collection('contacts');
        const contacts = await contactsCollection.find({}).toArray();
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

// contact by ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const contactsCollection = db.collection('contacts');
        const contactId = req.params.id;

        // Ensure the ID is valid
        if (!ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const contact = await contactsCollection.findOne({ _id: new ObjectId(contactId) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact by ID:', error);
        res.status(500).json({ message: 'Failed to fetch contact' });
    }
});

module.exports = router;

