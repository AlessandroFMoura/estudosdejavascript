const User = require('../models/User');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const bcrypt = require('bcrypt');

const editUser = async(req, res) => {
    const { body: { name, email, phone, password, confirmpassword } } = req;
        
    if (req.headers.authorization) {
       
        // pega o token editado com o split
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (!user) {

            res.status(422).json({ message: 'Usuário não encontrado!' });
            return;
        }
    
        const userExists = await User.findOne({ email: email });
        
        // Verifica se o e-mail já está cadastrado para outro usuários.
        if (userExists && user.email !== email) {

            res.status(422).json({ message: 'Por favor utilizar outro e-mail' });
            return;
        }
        user.email = email;

        if(!phone){

            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return;
        }
        user.phone = phone;

        if (password != confirmpassword) {

            res.status(422).json({ message: 'As senhas não conferem!' })
            return;

        } else if (password === confirmpassword && password != null) {
            
            // creating password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash;
        }
       try {

        // upload da image
        if (req.file) {
            user.image = req.file.filename
        }
        
        // returns user updated data
        await User.findOneAndUpdate(
            { _id: user._id },
            { $set: user },
            { new: true },
        )
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' })

       } catch (err) {
        
        res.status(500).json({ message: err });
        return;


       }
    
    }
   
}

module.exports = editUser;