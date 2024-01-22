import express from 'express';
import { responder } from '../middlewares/response.js';
import slugify from 'slugify';
import { newProductValidation } from '../middlewares/joiValidation.js';
import { getAProduct, getProducts, insertProduct } from '../modules/product/ProductModel.js';
// import { deleteACategory, getACategory, getCategories, insertCategory, updateCategory } from '../modules/category/categoryModel.js';

const router = express.Router();

//create new category
router.post("/", newProductValidation, async(req, res, next)=> {
    try {
        
        req.body.slug = slugify(req.body.name, { 
            lower: true,
            trim: true,
         })

         const product = await insertProduct(req.body)

         product?._id ?
        responder.SUCCESS({
            res,
            message: "Product added Successfully"
        })
        :
        responder.ERROR({
            res,
            message: "Unable to add product try again later"
        })
    } catch (error) {
        if(error.message.includes("E11000 duplicate")){
            error.message = "Slug already exist, try changing the title and try again"
            errorCode = 200;
        }
        next(error)
    }
})

//get category
router.get("/:_id?", async(req, res, next)=> {
    try {
        const {_id} = req.params;
        const products = _id
        ? await getAProduct({_id})
        : await getProducts();

        responder.SUCCESS({
            res,
            message: "Here are the Products",
            products,
        })
    } catch (error) {
        next(error)
    }
})

//update category
// router.put("/", async(req, res, next)=> {
//     try {
//         const {_id, status, title} = req.body
//         if(_id && status && title ) {
//             const cat = await updateCategory({_id}, {
//                 status,
//                 title,
//             });
//             if(cat?._id){
//                 return responder.SUCCESS({
//                     res,
//                     message: "Category has been updated"
//                 })
//             }
//         }
        
//         responder.ERROR({
//             res,
//             message: "Invalid data"
//         })
//     } catch (error) {
//         next(error)
//     }
// })

//delete
// router.delete("/:_id", async(req, res, next)=> {
//     try {
//         const {_id} = req.params
//         const cat = await deleteACategory(_id)
//         cat?._id ?
//         responder.SUCCESS({
//             res,
//             message: "The Category has been deleted"
//         }) :
//         responder.ERROR({
//             res,
//             message: "Error deleting category, try again later"
//         })
//     } catch (error) {
//         next(error)
//     }
// })

export default router
