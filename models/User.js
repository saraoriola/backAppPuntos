const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Por favor rellena tu nombre"],
        },

        email: {
            type: String,
            required: [true, "Por favor rellena tu email"],
        },

        password: {
            type: String,
            required: [true, "Por favor rellena tu contraseña"],
        },

        age: {
            type: Number,
            // required: [true, "Por favor rellena tu edad"],
        },

        confirmed: {
            type: Boolean,
            default: false,
        },

        _idDoubt: [
            {
                type: Schema.Types.ObjectId,
                ref: "Doubt",
            },
        ],

        points: Number,

        role: String,

        tokens: [],
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
