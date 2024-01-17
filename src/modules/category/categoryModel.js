import CategorySchema from './CategorySchema.js';

export const insertCategory = (obj) => {
    return CategorySchema(obj).save();
}

export const updateCategory = (filter, update) => {
    return CategorySchema.findOneAndUpdate(filter, update);
}

//get category by filter
export const getACategory = (filter) => {   //filter should be object
    return CategorySchema.findOne(filter);
}
export const getCategories = () => {   //filter should be object
    return CategorySchema.find();
}

export const deleteACategory = (_id) => {
   return CategorySchema.findByIdAndDelete(_id)
}