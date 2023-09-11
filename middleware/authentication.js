const User = require("../models/User");
const Doubt = require("../models/Doubt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: payload._id, tokens: token });

        if (!user) {
            return res.status(401).send({ message: "No estás autorizado" });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: "Ha habido un problema con el token" });
    }
};


const isTeacher = async (req, res, next) => {
    const teachers = ["teacher", "tAssis"];
    if (!teachers.includes(req.user.role)) {
        return res.status(403).send({ message: "Acceso denegado. No eres profesor" });
    }
    next();
};

const isStudent = async (req, res, next) => {
    try {
        const doubt = await Doubt.findById(req.body._idDoubt);

        if (doubt._idUser.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: "No puedes editar esta duda, no es tuya" });
        }

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).send({ error, message: "Hubo un problema al comprobar la autoría de la duda" });
    }
};


const isAuthor = async (req, res, next) => {
    try {
      const doubt = await Doubt.findById(req.params._id);
      if (doubt.user.toString() !== req.user._id.toString()) {
        return res.status(403).send({ message: 'You are not the author' });
      }
      const answer = await Doubt.findById(req.params._id);
      if (answer.user.toString() !== req.user._id.toString()) {
        return res.status(403).send({ message: 'You are not the author' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        error,
        message: 'There was a problem checking the answer authorship',
      });
    }
  };
module.exports = { authentication, isTeacher, isStudent, isAuthor};
