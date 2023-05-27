// Mongoose model - is a noun in a single form, so we name the file contact.js
const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

// we create a new schema using "new", because we need it for ES6 modules
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Name is required"],
    },
    phone: {
      type: String,
      match: phoneRegex,
    },
    // if this field is not submitted, default value will be false
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId, // an _id, generated by MongoDB
      ref: "user", // the name of the collection that the ID belongs to
      required: true,
    },
  },
  {
    // removes "_v" and adds creation and changing timestamps to document
    versionKey: false,
    timestamps: true,
  }
);

// Validates body for POST method
const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string()
    .regex(phoneRegex, "Phone number must be in the format (123) 456-7890")
    .required(),
  favorite: Joi.boolean(),
});

// Validates body for PUT method
const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().pattern(emailRegex),
  phone: Joi.string().regex(
    phoneRegex,
    "Phone number must be in the format (123) 456-7890"
  ),
  favorite: Joi.boolean(),
});

// Validates body for PATCH method
const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

// if during saving we have an error, this middleware is set, otherwise mongoose error doesn't set error.status
contactSchema.post("save", handleMongooseError);

const schemas = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
};

// model() method creates a model of the Schema. It is a Class, so we use capital letter. 1st argument - name of the collection of DB in a single form, 2nd - schema
const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};