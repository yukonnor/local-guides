import Ajv from "ajv";
import addFormats from "ajv-formats";
import userCreateSchema from "./userCreateSchema.js";
import userUpdateSchema from "./userUpdateSchema.js";
import userRegisterSchema from "./userRegisterSchema.js";
import userLoginSchema from "./userLoginSchema.js";
import guideCreateSchema from "./guideCreateSchema.js";
import guideUpdateSchema from "./guideUpdateSchema.js";
import guideFetchSchema from "./guideFetchSchema.js";
import guideShareSchema from "./guideShareSchema.js";
import placeCreateSchema from "./placeCreateSchema.js";
import placeUpdateSchema from "./placeUpdateSchema.js";
import googleSearchPlaceSchema from "./googleSearchPlaceSchema.js";
import tagSchema from "./tagSchema.js";

const ajv = new Ajv();
addFormats(ajv);

const userCreateValidate = ajv.compile(userCreateSchema);
const userUpdateValidate = ajv.compile(userUpdateSchema);
const userRegisterValidate = ajv.compile(userRegisterSchema);
const userLoginValidate = ajv.compile(userLoginSchema);
const guideCreateValidate = ajv.compile(guideCreateSchema);
const guideUpdateValidate = ajv.compile(guideUpdateSchema);
const guideFetchValidate = ajv.compile(guideFetchSchema);
const guideShareValidate = ajv.compile(guideShareSchema);
const placeCreateValidate = ajv.compile(placeCreateSchema);
const placeUpdateValidate = ajv.compile(placeUpdateSchema);
const googleSearchPlaceValidate = ajv.compile(googleSearchPlaceSchema);
const tagValidate = ajv.compile(tagSchema);

export {
    userCreateValidate,
    userUpdateValidate,
    userRegisterValidate,
    userLoginValidate,
    guideCreateValidate,
    guideUpdateValidate,
    guideFetchValidate,
    guideShareValidate,
    placeCreateValidate,
    placeUpdateValidate,
    googleSearchPlaceValidate,
    tagValidate,
};
