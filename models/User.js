import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    accountType: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isEditor: {
        type: Boolean,
        default: false,
    },
    // isPartner: {
    //     type: Boolean,
    //     default: false,
    // },
    // isDriver: {
    //     type: Boolean,
    //     default: false,
    // },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
)


export default mongoose.model("User", UserSchema)