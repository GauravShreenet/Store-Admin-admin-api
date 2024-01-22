import express from 'express';
import { responder } from '../middlewares/response.js';
import slugify from 'slugify';
import { newProductValidation, updateProductValidation } from '../middlewares/joiValidation.js';
import { getAProduct, getProducts, insertProduct, updateProductById } from '../modules/product/ProductModel.js';
import multer from 'multer';
// import { deleteACategory, getACategory, getCategories, insertCategory, updateCategory } from '../modules/category/categoryModel.js';

const router = express.Router();

const imgFolderPth = "public/img/product"
//multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        let error = null;
        
        cb(error, imgFolderPth)
    },
    filename: function (req, file, cb) {
        const fullFileName = Date.now() + '-' + file.originalname;
        let error = ""

        cb(error, fullFileName)
    }
})

const upload = multer({ storage })

//End multer config



//create new category
router.post("/", upload.array("images", 5), newProductValidation, async(req, res, next)=> {
    try {
        //get the file path where it was uploaded and store in the db
        if(req.files?.length){
           const newImgs = req.files.map((item)=>item.path.slice(6))
           req.body.images = newImgs;
           req.body.thumbnail = newImgs[0];
        }

        req.body.slug = slugify(req.body.name, { 
            lower: true,
            trim: true,
         })

         //insert into db

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

router.put("/", upload.array("newImages", 5), updateProductValidation, async(req, res, next)=> {
    try {
        //handle deleting image
        const { imgToDelete } = req.body;
        // remove photo from folder
        req.body.images = req.body?.images.split(",")
        if (imgToDelete?.length) {
            req.body.images = req.body?.images.filter(
            (url) => !imgToDelete.includes(url)
            //
          );
        }
        // get the file path where it was upload and store in the db

        if (req.files?.length) {
            const newImgs = req.files.map((item) => item.path.slice(6));
            req.body.images = [...req.body.images, ...newImgs];
          }
    
          const product = await updateProductById(req.body);

         product?._id ?
        responder.SUCCESS({
            res,
            message: "Product has been updated Successfully"
        })
        :
        responder.ERROR({
            res,
            message: "Unable to update the product try again later"
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
