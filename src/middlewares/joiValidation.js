import Joi from 'joi';
import { responder } from './response.js';

//constants
const SHORTSTR = Joi.string().max(100).allow(null, "");
const SHORTSTRREQ = SHORTSTR.required()
const NUM = Joi.number().allow(null, "");;
const NUMREQ = NUM.required()
const LONGSTR = Joi.string().max(500).allow(null, "");
const LONGSTRREQ = LONGSTR.required()
const EMAIL = Joi.string().email({minDomainSegments: 2}).max(100).allow(null, "");
const EMAILREQ = EMAIL.required()


const joiValidator = ({schema, req, res, next}) => {
    try {
        
        const { error } = schema.validate(req.body);        
        if(error){
            return responder.ERROR({res, message: error.message});
        }
        next();
    } catch (error) {
        next(error)
    }
}

export const newAdminValidation = (req, res, next) => {
    const schema = Joi.object({
        fName: SHORTSTRREQ,
        lName: SHORTSTRREQ,
        email: EMAILREQ,
        phone: SHORTSTR,
        address: SHORTSTR,
        password: SHORTSTRREQ,
    })

    joiValidator({schema, req, res, next})
}

export const resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        otp: SHORTSTRREQ,
        email: EMAILREQ,
        password: SHORTSTRREQ,
    })

    joiValidator({schema, req, res, next})
}

// ============== product
export const newProductValidation = (req, res, next) => {
    const schema = Joi.object({
        // status: SHORTSTRREQ,
        name: SHORTSTRREQ,
        parentCatId: SHORTSTRREQ,
        sku: SHORTSTRREQ,
        price: NUMREQ,
        qty: NUMREQ,
        salesPrice: NUM,
        description: LONGSTRREQ,
        salesStartDate: SHORTSTR,
        salesEndDate: SHORTSTR,
    })

    joiValidator({schema, req, res, next})
}

export const updateProductValidation = (req, res, next) => {
    req.body.salesPrice = 
    req.body.salesPrice === "null" ? null : req.body.salesPrice
    const schema = Joi.object({
        status: SHORTSTR,
        _id: SHORTSTRREQ,
        name: SHORTSTRREQ,
        parentCatId: SHORTSTRREQ,
        price: NUMREQ,
        qty: NUMREQ,
        salesPrice: NUM,
        description: LONGSTRREQ,
        salesStartDate: SHORTSTR,
        salesEndDate: SHORTSTR,
        images: LONGSTRREQ,
        thumbnail: LONGSTRREQ,
        imgToDelete: LONGSTR,
    })

    joiValidator({schema, req, res, next})
}