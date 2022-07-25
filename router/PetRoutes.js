const router = require('express').Router();

const PetController = require('../controllers/PetController');

// middleware
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');
const validationPets = require('../helpers/validation-pets');

router.post('/create', verifyToken, imageUpload.array('images'), validationPets, PetController.create);
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoption', verifyToken, PetController.getAllUserAdoptions);
router.get('/:id', PetController.getPetById);
router.delete('/:id', verifyToken, PetController.removePetById);
router.patch('/:id', verifyToken, imageUpload.array('images'), validationPets, PetController.updatePet);
router.patch('/schedule/:id', verifyToken, PetController.schedule);
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);

module.exports = router;