import express from 'express';
import { responder } from '../middlewares/response.js';
import slugify from 'slugify';
import { deleteACategory, getACategory, getCategories, insertCategory, updateCategory } from '../modules/category/categoryModel.js';

const router = express.Router();

//create new category
router.post("/", async(req, res, next)=> {
    try {
        const {title} = req.body

        const obj = {
            title,
            slug: slugify(title, {
                lower: true,
                trim: true,
            })

            
        }

        const cat = await insertCategory(obj);

        cat?._id ? 
        responder.SUCCESS({
            res,
            message: "New Category has been added successfully"
        })
        :
        responder.ERROR({
            res,
            message: "Unable to add a new category"
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
        const categories = _id
        ? await getACategory({_id})
        : await getCategories();

        responder.SUCCESS({
            res,
            message: "Here are the categories",
            categories,
        })
    } catch (error) {
        next(error)
    }
})

//update category
router.put("/", async(req, res, next)=> {
    try {
        const {_id, status, title} = req.body
        if(_id && status && title ) {
            const cat = await updateCategory({_id}, {
                status,
                title,
                slug: slugify(title, {
                    lower: true,
                    trim: true,
                })
            });
            if(cat?._id){
                return responder.SUCCESS({
                    res,
                    message: "Category has been updated"
                })
            }
        }
        
        responder.ERROR({
            res,
            message: "Invalid data"
        })
    } catch (error) {
        next(error)
    }
})

//delete
router.delete("/:_id", async(req, res, next)=> {
    try {
        const {_id} = req.params
        const cat = await deleteACategory(_id)
        cat?._id ?
        responder.SUCCESS({
            res,
            message: "The Category has been deleted"
        }) :
        responder.ERROR({
            res,
            message: "Error deleting category, try again later"
        })
    } catch (error) {
        next(error)
    }
})

export default router
