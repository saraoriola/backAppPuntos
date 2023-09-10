const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
    answer: {
        type: String,
        required: [true, 'Please, fill in the answer'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    votes: Number,
});

const doubtSchema = new Schema(
    {
        doubt: {
            type: String,
            required: [true, 'Please, fill in the doubt'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        answers: [answerSchema],
        resolved: {
            type: Boolean,
            default: false,
        },
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

const Doubt = mongoose.model("Doubt", doubtSchema);

module.exports = Doubt;
