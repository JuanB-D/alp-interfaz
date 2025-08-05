const initialStudents = {
    'Juan Felipe Calle': {
        name: 'Juan Felipe Calle',
        average: 3.5,
        notes: [3.0, 4.0, 3.5],
        reports: [{ title: 'Reporte Inicial', text: 'Excelente participación en clase.' }]
    },
    'Emmanuel Valles Gómez': {
        name: 'Emmanuel Valles Gómez',
        average: 3.0,
        notes: [3.0],
        reports: []
    },
    'Keiner Maturana': {
        name: 'Keiner Maturana',
        average: 4.0,
        notes: [4.0],
        reports: []
    },
    'Wendy Daniela Ortiz': {
        name: 'Wendy Daniela Ortiz',
        average: 4.5,
        notes: [4.5],
        reports: []
    },
    'María Camila Giraldo': {
        name: 'María Camila Giraldo',
        average: 4.2,
        notes: [4.2],
        reports: []
    }
};

const studentsDB = { ...initialStudents }; // Creamos una copia para poder modificarla

const classesData = [
    { name: '11 - Castellano', color: 'blue' },
    { name: '10A - Castellano', color: 'purple' },
    { name: '10B - Castellano', color: 'green' },
    { name: '9A - Castellano', color: 'cyan' },
    { name: '9B - Castellano', color: 'yellow' },
    { name: '8B - Castellano', color: 'orange' },
];

module.exports = {
    studentsDB,
    classesData
};
