// api/reports/[studentName].js
module.exports = (req, res) => {
    const { studentName } = req.query;
    console.log(`Obteniendo reportes para: ${studentName}`);
    
    const studentReports = [
        { activity: 'Exposición Sobre El Rebelión', note: 3.4 },
        { activity: 'Taller Sobre El Rebelión', note: 4.0 },
        { activity: 'Taller Sobre El Rebelión', note: 4.0 },
    ];
    res.status(200).json(studentReports);
};
