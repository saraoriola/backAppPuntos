const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
    answer: {
        type: String,
        required: [true, 'Please, fill in the answer'],
        ref: "Answer",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
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
        answers: [
            {
                answer: {
                    type: String,
                    required: [true, 'MODEL'],
                    ref: "Answer"
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            }
        ],
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
