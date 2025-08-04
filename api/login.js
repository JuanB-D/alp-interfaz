// api/login.js
const cors = require('cors'); // Vercel recomienda usar CORS para funciones
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

module.exports = (req, res) => {
    const { user, password, userType } = req.body;
    console.log(`Intento de login: Usuario=${user}, Tipo=${userType}`);
    
    if (user === 'maestro' && password === '1234') {
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
};
