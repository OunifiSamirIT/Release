const express = require('express');
const {AddEvents,DeleteEvents,FindAllEvents,FindSinglEvents,UpdateEvents } = require('../controllers/Event.controller');
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
router.post('/Event', upload.single("image"), AddEvents)

/* find all users */
router.get('/Event', FindAllEvents)

/* find single user */
router.get('/Event/:id', FindSinglEvents)

/* add user */
router.put('/Event/:id', UpdateEvents)

/* add user */
router.delete('/Event/:id', DeleteEvents)

module.exports = router;