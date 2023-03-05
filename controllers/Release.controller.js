const Release = require("../models/release.models");
const ValidateUser = require("../validation/Users.validation");
const contributor = require("../models/contributorSchema");
const user = require("../models/userSchema");
const AddRelease = async (req, res) => {
  const { Notes, Testeur, Version, Date, File } = req.body;

  console.log(req.body.cv);
  const verif = await Release.findOne({ Date });
  if (verif) {
    console.log("Release With the same Date already exists");
    res
      .status(403)
      .send({
        error:
          "Release with the same Date already exists ! Please USe An Other Date",
      });
  } else {
    console.log("Success");
    const newEvent = new Release();
    newEvent.Notes = Notes;
    newEvent.Testeur = Testeur;
    newEvent.Version = Version;
    newEvent.Date = Date;

    if (req.file) {
      console.log(req.file.path);
      let txt = req.file.path;
      let nextTXT = txt.replace("uploads", "");
      let last = nextTXT.replace("images", "");

      newEvent.image = last;
    }
    newEvent.save();
    
    res.status(201).send(newEvent);
    ({ message: "Release Add with success" });
  }
};

const FindAllRelease = async (req, res) => {
  try {
    const data = await Release.find();
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const FindSinglRelease = async (req, res) => {
  try {
    const data = await Release.findOne({ _id: req.params.id });
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateRelease = async (req, res) => {
  const { errors, isValid } = ValidateUser(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      const data = await Release.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      res.status(201).json({ message: "Release update with success" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteRelease = async (req, res) => {
  try {
    await Release.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: "Release deleted with success" });
  } catch (error) {
    console.log(error.message);
  }
};


const FindAllTesteur = async (req, res) => {
  try {
    const data = await contributor.find({ role: "Testeur" }).populate({
      path: "user",
      select: "username",
    });
    const aa = data.map((a) => a.username);
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  AddRelease,
  FindAllRelease,
  FindSinglRelease,
  UpdateRelease,
  DeleteRelease,
  FindAllTesteur,
};
