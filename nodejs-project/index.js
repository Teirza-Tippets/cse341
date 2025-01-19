const express = require('express');
const nameRoute = require('./routes/nameRoute');
const contactsRoute = require('./routes/contacts'); 
const app = express();
const PORT = process.env.PORT || 3000;

// week 01 code :)
app.use('/', nameRoute);

//week 02 code :)
require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('myDatabase');
        
        // Pass database to routes
        app.locals.db = db;

        // Use the contacts route
        app.use('/contacts', contactsRoute);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

main();

// for all contacts :)
app.get('/contacts', async (req, res) => {
    try {
        const db = client.db('myDatabase'); 
        const contactsCollection = db.collection('contacts');
        const contacts = await contactsCollection.find({}).toArray();
        res.json(contacts); 
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
