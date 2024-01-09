import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    associate: {
        type: String,
        default: "",
    },
},
    {
        timestamps: true
    }
);

const SessionSchema =  mongoose.model("Session", userSchema)

//fuction to run CURD
export const createNewSession = obj => {
    return SessionSchema(obj).save();
}