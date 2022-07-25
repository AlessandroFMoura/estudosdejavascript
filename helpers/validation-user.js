const User = require('../models/User');
const editUser = require('./edit-user');

const validationUser = async (req, res, next) => {
    const { body: { name, email, password, confirmpassword, phone } } = req

    // Validadtions
    const userExists = await User.findOne({ email: email });
    if (!name) {
        res.status(422).json({ message: 'O nome é obrigatório!' })
        return;    
    }
    if (!email) {
        res.status(422).json({ message: 'O e-mail é obrigatório!' })
        return;
    } else if(userExists ){
        res.status(422).json({ message: 'O e-mail Já exite, escolha outro por favor!' })
        return;
    }
    
    await editUser(req, res);

    if (!password){
        res.status(422).json({ message: 'A senha é obrigatória!' })
        return;
    }
    if (!confirmpassword) {
        res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
        return;
    }
    if(!phone){
        res.status(422).json({ message: 'O telefone é obrigatório!' })
        return;
    }
    if (password !== confirmpassword) {
        res.status(422).json({ message: 'As senhas não conferem!!!' })
        return;
    } 

    return next()
}
module.exports =  validationUser;