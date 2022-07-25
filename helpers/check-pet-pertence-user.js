const Pet = require('../models/Pet')
const getToken = require('./get-token');
const getUserByToken = require('./get-user-by-token');
const checkPetExists = require('./check-pet-exists')

const checkPetPertenceUser = async (id, req, res) => {
    
    const pet = await Pet.findOne({ _id: id })

    await checkPetExists(id, req, res);

    const token = getToken(req);
    const user = await getUserByToken(token);

    
    if(pet.user._id.equals(user._id)){
        res.status(422).json({ message: 'Você não pode agendar uma visita com seu próprio pet!' });
        return;
    }

    //check if user has already scheduled a visit
    if(pet.adopter){
        if(pet.adopter._id.equals(user._id)){
            res.status(422).json({ message: 'Você já agendou uma visita para esse pet!' });
            return;
        }
        
    }
    // add user to pet
    pet.adopter = {
        _id: user._id,
        name: user.name,
        image: user.image
    }

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
        message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name}, pelo telefone ${pet.user.phone} `
    })
    
};

module.exports = checkPetPertenceUser;