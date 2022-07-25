
const validationPets = async (req, res, next) => {
    const { body: { name, age, weight, color } } = req;

    if(!name){
        res.status(422).json({ message: "O nome é obrigatário" });
        return;
    }
    if(!age){
        res.status(422).json({ message: "A idade é obrigatária" });
        return;
    }
    if(!weight){
        res.status(422).json({ message: "O peso é obrigatário" });
        return;
    }
    if(!color){
        res.status(422).json({ message: "A cor é obrigatária" });
        return;
    }

    return next();
    
}


module.exports =  validationPets;