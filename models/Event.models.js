const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    Nom: String,
    Date: String,
    Artistes  :  String,
    Lien: String,
    image:  String
   
}, {timestamps: true})




module.exports = mongoose.model('event', EventSchema)
