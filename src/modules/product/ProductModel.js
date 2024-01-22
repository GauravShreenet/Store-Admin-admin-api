import ProductSchema from './ProductSchema.js';

export const insertProduct = (obj) => {
    return ProductSchema(obj).save();
}

export const updateProduct = (filter, update) => {
    return ProductSchema.findOneAndUpdate(filter, update);
}

export const updateProductById = ({_id, ...rest}) => {
    return ProductSchema.findByIdAndUpdate(_id, rest);
}

//get product by filter
export const getAProduct = (filter) => {   //filter should be object
    return ProductSchema.findOne(filter);
}

export const getAProductBySlug = (slug) => {   //use Slug
    return ProductSchema.findOne({slug});
}

export const getProducts = () => { 
    return ProductSchema.find();
}

export const deleteAProduct = (_id) => {
   return ProductSchema.findByIdAndDelete(_id)
}