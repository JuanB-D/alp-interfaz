// api/classes.js
module.exports = (req, res) => {
    const classesData = [
        { name: '11 - Castellano', color: 'blue' },
        { name: '10A - Castellano', color: 'purple' },
        { name: '10B - Castellano', color: 'green' },
        { name: '9A - Castellano', color: 'cyan' },
        { name: '9B - Castellano', color: 'yellow' },
        { name: '8B - Castellano', color: 'orange' },
    ];
    res.status(200).json(classesData);
};
