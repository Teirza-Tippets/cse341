const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Validation middleware
const validateContact = (req, res, next) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({
      message: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required.'
    });
  }
  // Add more specific validation if necessary (e.g., email format, birthday as a valid date)
  next();
};

// All contacts
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

// Contact by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contactsCollection = db.collection('contacts');
    const contactId = req.params.id;

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

// POST Create new contact
router.post('/', validateContact, async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const db = req.app.locals.db;
    const contactsCollection = db.collection('contacts');

    const result = await contactsCollection.insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    console.log('Inserted contact ID:', result.insertedId);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Failed to create contact' });
  }
});

// PUT Update existing contact
router.put('/:id', validateContact, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = req.app.locals.db;
    const contactsCollection = db.collection('contacts');

    const result = await contactsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName, email, favoriteColor, birthday } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).json({ message: 'Contact updated successfully.' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Failed to update contact' });
  }
});

// DELETE Remove contact
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = req.app.locals.db;
    const contactsCollection = db.collection('contacts');

    const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

module.exports = router;
