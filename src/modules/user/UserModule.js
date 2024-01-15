import UserSchema from './UserSchema.js';

export const insertUser = (obj) => {
    return UserSchema(obj).save();
}

export const updateUser = (filter, update) => {
    return UserSchema.findOneAndUpdate(filter, update);
}

//get user by filter
export const getAUser = (filter) => {   //filter should be object
    return UserSchema.findOne(filter);
}