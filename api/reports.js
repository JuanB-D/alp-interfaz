// api/reports.js
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

module.exports = (req, res) => {
    const { studentName, reportText } = req.body;
    console.log(`Enviando reporte para ${studentName}: ${reportText}`);
    res.status(200).json({ success: true, message: `Reporte enviado para ${studentName}` });
};
