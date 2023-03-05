const express = require('express');
const { FindAllTesteur,AddRelease,DeleteRelease,FindAllRelease,FindSinglRelease,UpdateRelease } = require('../controllers/Release.controller');
const router = express.Router()
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/images");
    },
    filename: (req, file, cb) => {
        const newFileName = (+new Date()).toString() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const upload = multer({ storage });
 

/* add user */
router.post('/release', upload.single("image"), AddRelease)

/* find all users */
router.get('/release', FindAllRelease)
router.get('/releaseTesteur', FindAllTesteur)

/* find single user */
router.get('/release/:id', FindSinglRelease)

/* add user */
router.put('/release/:id', UpdateRelease)

/* add user */
router.delete('/release/:id', DeleteRelease)

module.exports = router;