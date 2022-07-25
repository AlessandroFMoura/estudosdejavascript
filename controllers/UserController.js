const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const editUser = require('../helpers/edit-user')

module.exports = class UserController {
   
    static async register(req, res){
        const { body: { name, email, password, phone } } = req
        
        // create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
           
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error });
        }

    }

    static async login(req, res){
        const { body: { email, password } } = req

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!'})
            return;
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório!'})
            return;
        }

        const user =  await User.findOne({ email: email })
        if (!user) {
            res.status(422).json({ message: 'Usuário não exite!'})
            return;
        }

        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta!'})
            return;
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) { // Pega o usuário que está usando o sistema autalmente.

        let currentUser

        if (req.headers.authorization) {
            
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id);

            currentUser.password = undefined;

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {
        const id = req.params.id;

        const user = await User.findById(id)
        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' });
            return;
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
      
        await editUser(req, res);
      
    }
}