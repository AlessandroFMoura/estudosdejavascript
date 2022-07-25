const Pet = require('../models/Pet')

const checkPetExists = async (id, req, res) => {

    const pet = await Pet.findOne({ _id: id })

    if(!pet) {
        res.status(404).json({ message: 'Pet não encontrado!' });
        return;
    } 
};

module.exports = checkPetExists;