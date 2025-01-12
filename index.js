const express = require('express');
const nameRoute = require('./routes/nameRoute');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/name', nameRoute);

app.get('/', (req, res) => {
    res.send('Hello! This is the home route.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

