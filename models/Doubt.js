const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoubtSchema = new Schema(
    {
        doubt: { type: String, required: [true, 'Please, fill in the doubt'] },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        answers: [
            {
                answer: {
                    type: String,
                    required: [true, 'Please, fill in the answer'],
                },
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                votes: Number,
            },
        ],
        resolved: { type: Boolean },
        topic: String,
        question: String,
        _idAnswer: [
            {
                type: Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
        _idUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Doubt = mongoose.model("Doubt", DoubtSchema);

module.exports = Doubt;
