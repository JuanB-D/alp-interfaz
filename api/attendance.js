// api/attendance.js
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

module.exports = (req, res) => {
    const { studentName, date, status } = req.body;
    console.log(`Asistencia de ${studentName} el ${date} marcada como: ${status}`);
    res.status(200).json({ success: true, message: 'Asistencia guardada' });
};
