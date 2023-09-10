const Doubt = require("../models/Doubt");
const User = require("../models/User");

const DoubtController = {
    async createDoubt(req, res, next) {
        try {
            const { topic, question } = req.body;

            if (!topic || !question) {
                return res.status(400).send({ message: "All fields must be filled out" });
            }

            const existingDoubt = await Doubt.findOne({ question });
            if (existingDoubt) {
                return res.status(409).json({ message: 'This query already exists' });
            }

            const doubt = await Doubt.create({ ...req.body, user: req.user._id });
            await User.findByIdAndUpdate(req.user._id, { $push: { _idDoubt: doubt._id } });

            res.status(201).send({ message: "Your query has been created", doubt });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    async getAllDoubts(req, res) {
        try {
            const doubts = await Doubt.find();

            res.status(200).send(doubts);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue fetching doubts" });
        }
    },

    async getDoubtById(req, res) {
        try {
            const { _id } = req.params;
            const doubt = await Doubt.findById(_id)
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
                });
    
            if (!doubt) {
                return res.status(404).send({ message: "The doubt does not exist" });
            }
    
            res.status(200).send({ message: "Doubt obtained successfully", doubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue fetching the doubt" });
        }
    },
    

    async getDoubtsWithPagination(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 2;
            const skip = (page - 1) * limit;

            const doubts = await Doubt.find().limit(limit).skip(skip);

            res.status(200).send({ message: "Doubts with pagination (2 per page)", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue fetching doubts" });
        }
    },

    async getAllDoubtsWithDetails(req, res) {
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

            res.status(200).send({ message: "Data obtained successfully", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching doubts and answers" });
        }
    },

    async updateDoubtById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const { _id } = req.params;
            const updatedDoubt = await Doubt.findByIdAndUpdate(_id, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "The query does not exist" });
            }

            res.status(200).send({ message: "Query updated successfully", query: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue updating the query" });
        }
    },

    async updateDoubtByTopic(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const { topic } = req.params;
            const updatedDoubt = await Doubt.findOneAndUpdate({ topic }, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "No query found with that topic" });
            }

            res.status(200).send({ message: "Query updated successfully", query: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue updating the query" });
        }
    },

    async markDoubtAsResolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const { doubtId } = req.params;
            const { resolved } = req.body;

            if (resolved === undefined) {
                return res.status(400).send({ message: "Missing 'resolved' field" });
            }

            const query = await Doubt.findByIdAndUpdate(doubtId, { resolved }, { new: true });

            if (!query) {
                return res.status(404).send({ message: "The query does not exist" });
            }

            res.status(200).send({ message: "The query has been marked as resolved!", query });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue updating the query status" });
        }
    },

    async markDoubtAsUnresolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const { doubtId } = req.params;

            const query = await Doubt.findByIdAndUpdate(doubtId, { resolved: false }, { new: true });

            if (!query) {
                return res.status(404).send({ message: "The query does not exist" });
            }

            res.status(200).send({ message: "The query has been marked as unresolved", query });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue updating the query status" });
        }
    },

    async deleteDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "You are not authenticated" });
            }

            const { doubtId } = req.params;

            const deletedDoubt = await Doubt.findByIdAndDelete(doubtId);

            if (!deletedDoubt) {
                return res.status(404).send({ message: "The query does not exist" });
            }

            res.status(200).send({ message: "Query deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was an issue deleting the query" });
        }
    },
};

module.exports = DoubtController;
