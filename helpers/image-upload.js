const multer = require('multer');
const path = require('path');

// Destination to store the images

const imageStore = multer.diskStorage({

    destination: function (req, file, cb) {
        
        let folder = ""

        if (req.baseUrl.includes("users")) {

            folder = "users"

        } else if (req.baseUrl.includes("pets")) {

            folder = "pets"
        }

        cb(null, `public/images/${folder}`);

    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))

    },
}); // ficará mais ou menos assim 1235468461698.jpg

const imageUpload = multer({

    storage: imageStore,
    
    fileFilter(req, file, cb) {
    
        if (!file.originalname.match(/\.(png|jpg)$/)) { // isso é um reject verifica se após o ponto tem png ou jpg
    
            return cb(new error('Por favor, envie somente jpg ou png!'))
    
        }
    
        cb(undefined, true)
    },
})

module.exports = { imageUpload };