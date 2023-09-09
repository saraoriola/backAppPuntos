const Doubt = require("../models/Doubt");
const User = require("../models/User");

const DoubtController = {
    async createDoubt(req, res, next) {
        try {
            const { topic, question } = req.body;
    
            if (!topic || !question) {
                return res.status(400).send({ message: "You need to fill out all fields" });
            }
    
            const existingDoubt = await Doubt.findOne({ question });
            if (existingDoubt) {
                return res.status(409).json({ message: 'This query already exists' });
            }
    
            const query = await Doubt.create({ ...req.body, user: req.user._id });
            await User.findByIdAndUpdate(req.user._id, { $push: { _idDoubt: query._id } });
    
            res.status(201).send({ message: "Your query has been created", query });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
    

    async updateDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const updatedDoubt = await Doubt.findOneAndUpdate({}, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "No se encontró ninguna consulta para actualizar" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", query: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async updateDoubtById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { _id } = req.params;
            const updatedDoubt = await Doubt.findByIdAndUpdate(_id, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", query: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async updateDoubtByTopic(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { topic } = req.params;
            const updatedDoubt = await Doubt.findOneAndUpdate({ topic }, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "No se encontró ninguna consulta con ese tema" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", query: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async getAllDoubtsPagination(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 2;
            const skip = (page - 1) * limit;

            const doubts = await Doubt.find().limit(limit).skip(skip);

            res.status(200).send({ message: "Estás viendo las dudas con paginación de 2 en 2", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al obtener las consultas" });
        }
    },

    async getEverything(req, res) {
        try {
            const doubts = await Doubt.find()
                .populate({
                    path: "_idUser",
                    select: "_id name",
                })
                .populate({
                    path: "_idAnswer",
                    select: "_id reply likes",
                    populate: {
                        path: "_idUser",
                        select: "_id name",
                    },
                })
                .select("_id topic question _idAnswer");

            res.status(200).send({ message: "Datos obtenidos exitosamente", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las dudas y respuestas" });
        }
    },

    async markDoubtAsResolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { queryId } = req.params;
            const { resolved } = req.body;

            if (resolved === undefined) {
                return res.status(400).send({ message: "Falta proporcionar el campo 'resolved'" });
            }

            const query = await Doubt.findByIdAndUpdate(queryId, { resolved }, { new: true });

            if (!query) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "La consulta se marcó como resuelta!", query });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar el estado de la consulta" });
        }
    },

    async markDoubtAsUnresolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { queryId } = req.params;

            const query = await Doubt.findByIdAndUpdate(queryId, { resolved: false }, { new: true });

            if (!query) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "OK! La consulta fue marcada como no resuelta", query });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar el estado de la consulta" });
        }
    },

    async deleteDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { queryId } = req.params;

            const deletedDoubt = await Doubt.findByIdAndDelete(queryId);

            if (!deletedDoubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "Consulta eliminada exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al eliminar la consulta" });
        }
    },
};

module.exports = DoubtController;
