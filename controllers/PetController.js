const Pet = require('../models/Pet');

// helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId;
const checkPetExists = require('../helpers/check-pet-exists');
const checkPetPertenceUser = require('../helpers/check-pet-pertence-user');

module.exports = class PetController {

    // Create a pet

    static async create(req, res) {
        const { body: { name, age, weight, color } } = req;
        const available = true;

        // images upload
        const images = req.files;

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória!' });
            return;
        }

        // a validação ta nos middleware com o nome de validationPet lá nas rotas.

        // get pet owner
        const token = getToken(req);
        const user = await getUserByToken(token)

        // Create a per
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            image: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image) => { //não entendi muito bem o que esse map faz aqui
            pet.images.push(image.filename)
        })

        try {
            
            const newPet = await pet.save();
            res.status(201).json({
                message: 'Pet cadastrado com Sucesso!',
                newPet,
            })

        } catch (error) {
            res.status(500).json({ message: error });
        }

    }

    static async getAll(req, res){
        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res) {
        // get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'user._id': user._id }).sort('-createdAt');

        res.status(200).json({ pets });
    } 

    static async getAllUserAdoptions(req, res) {
        // get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'adopter._id': user._id }).sort('-createdAt');

        res.status(200).json({ pets });
    }

    static async getPetById(req, res) {
        const id = req.params.id;
        const pet = await Pet.findOne({ _id: id })

        // check if id valid
        if (!ObjectId.isValid(id)) {
        
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }
        // check if pet exists
        await checkPetExists(id, req, res);
        // const pet = await Pet.findOne({ _id: id });
        
        // if (!pet) {
        //     res.status(404).json({ message: 'Pet não encontrado!' });
        // }

        res.status(200).json({ pet: pet });

    }

    static async removePetById(req, res) {
        const id = req.params.id;

        // check if id valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }
        
        // Check if pet exists
        await checkPetExists(id, req, res);
        // const pet = await Pet.findOne({ _id: id });
        // if(!pet){
        //     res.status(404).json({ message: 'Pet não encontrado!' });
        //     return;
        // }

        // Verificar se o usuário logado registrou o pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {

            res.status(422).json({ message: 'Houve um problema ao processar sua solicitação!' })
            return;
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({ message: `O pet ${pet.name} removido com sucesso!` })

    }

    static async updatePet(req, res) {

        const id = req.params.id;

        const { body: { name, age, weight, color, available } } = req

        const images = req.files

        const updatedData = {}

        // check if pet exists
        await checkPetExists(id, req, res);
        const pet = await Pet.findOne({ _id: id });

        // if(!pet) {
        //     res.status(404).json({ message: 'Pet não encontrado!' });
        //     return;
        // }

        // Verificar se o usuário logado registrou o pet
        // await checkPetPertenceUser(id, req, res);
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {

            res.status(422).json({ message: 'Houve um problema ao processar sua solicitação!' })
            return;
        }

        updatedData.name = name;
        updatedData.age = age;
        updatedData.weight = weight;
        updatedData.color = color;

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória!' });
            return;
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
            
        }
        

        await Pet.findByIdAndUpdate(id, updatedData);

        res.status(200).json({ messager: 'Pet atualizado com sucesso!' });

    }

    static async schedule(req, res) {
        const id = req.params.id;

        // checa se o pet existe
        await checkPetExists(id, req, res)
        
        // check if user registered the pet
        await checkPetPertenceUser(id, req, res);
        
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id;
        const pet = await Pet.findOne({ _id: id })

        await checkPetExists(id, req, res);

       // check if logged in user registered the pet
       const token = getToken(req);
       const user = await getUserByToken(token);

       if(pet.user._id.toString() !== user._id.toString()){
        res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' });
       }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            pet,
            message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'
        })

    }

}

