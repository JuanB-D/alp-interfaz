// api/notes.js
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

module.exports = (req, res) => {
    const { studentName, note } = req.body;
    console.log(`Asignando nota: ${note} a ${studentName}`);
    res.status(200).json({ success: true, message: `Nota ${note} asignada a ${studentName}` });
};
