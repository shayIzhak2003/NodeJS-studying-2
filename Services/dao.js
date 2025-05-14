const mongoose = require("mongoose");
////////////////////*******END OF GENERAL ENTITIES METHODS****////////////////////////////////////////
const DATABASE_NAME = "NODEJS-STUDYING-2";
const MONGO_URI = "mongodb://localhost:27017/" + DATABASE_NAME;
let cached = global.mongoose || { conn: null, promise: null };

let isConnected = false;

//Initial connection to DB
 const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    //await createInitData();
    console.log("db connected by mongoose 222");
  } catch (e) {
    if (e.name === "MongoServerError" && e.code === 18) {
      console.error(
        "Wrong credentials! \n***CHECK THE CREDENTIALS ON THE URI***"
      );
      // alert("wwww");
      throw "Authentication error";
    }
    console.log("Error in mongoose connection 222\n", e);
    throw "error on mongoose";
  }
};

 const getAllEntities = async (entityName, optionalScheme = null) => {
  connectDB();

  let EntityModel;
  try {
    EntityModel = mongoose.model(entityName); // Try to access the model
  } catch (err) {
    // If the model doesn't exist, create it
    if (optionalScheme == undefined || optionalScheme == null) {
      EntityModel = mongoose.model(
        entityName,
        new mongoose.Schema({}, { strict: false })
      );
    } else {
      EntityModel = mongoose.model(entityName, optionalScheme);
    }
  }
  const data = await EntityModel.find();
  // console.log("data from getALlBookmarks = " , data);
  return data;
};

 const getEntity = async (entityName, id, optionalScheme = null) => {
  connectDB();
  let EntityModel;
  try {
    EntityModel = mongoose.model(entityName); // Try to access the model
  } catch (err) {
    // If the model doesn't exist, create it
    if (optionalScheme == undefined || optionalScheme == null) {
      EntityModel = mongoose.model(
        entityName,
        new mongoose.Schema({}, { strict: false })
      );
    } else {
      EntityModel = mongoose.model(entityName, optionalScheme);
    }
  }
  return EntityModel.findById(id);
};

// return  addStockToDb.save();
 const createEntity = async (data, entityName, optionalScheme = null) => {

    
  connectDB();

  let EntityModel;
  try {
    EntityModel = mongoose.model(entityName); // Try to access the model
  } catch (err) {
    // If the model doesn't exist, create it
    if (optionalScheme == undefined || optionalScheme == null) {
      EntityModel = mongoose.model(
        entityName,
        new mongoose.Schema({}, { strict: false })
      );
    } else {
      EntityModel = mongoose.model(entityName, optionalScheme);
    }
  }
  const newItem = new EntityModel(data);
  return await newItem.save();
};

 const updateEntity = async (data, entityName, optionalScheme = null) => {
  connectDB();
  let EntityModel;
  try {
    EntityModel = mongoose.model(entityName); // Try to access the model
  } catch (err) {
    // If the model doesn't exist, create it
    if (optionalScheme == undefined || optionalScheme == null) {
      EntityModel = mongoose.model(
        entityName,
        new mongoose.Schema({}, { strict: false })
      );
    } else {
      EntityModel = mongoose.model(entityName, optionalScheme);
    }
  }

  // delete bookmark.currentPage;//possible to pass only required update properties.
  try {
    //this working, but return the updated object
    // const result = await EntityModel.updateOne(
    //     { _id: data._id }, // Find by ID
    //     { $set: data } // Use $set to update the fields
    // );
    const result = await EntityModel.findOneAndUpdate(
      { _id: data._id },
      { $set: data },
      { new: true }
    );
    if (!result) {
      throw new Error(entityName + " not found");
    }

    return result;
  } catch (error) {
    //console.error('Error updating bookmark:', error);
    throw error;
  }
};
//to pass: {"_id":"68093aa8cd34d55f46233c63"}
 const deleteEntity = async (id, entityName, optionalScheme = null) => {
  connectDB();

  let EntityModel;
  try {
    EntityModel = mongoose.model(entityName); // Try to access the model
  } catch (err) {
    // If the model doesn't exist, create it
    if (optionalScheme == undefined || optionalScheme == null) {
      EntityModel = mongoose.model(
        entityName,
        new mongoose.Schema({}, { strict: false })
      );
    } else {
      EntityModel = mongoose.model(entityName, optionalScheme);
    }
  }
  const toDelete = await EntityModel.findById(id);
  if (!toDelete) {
    throw new Error("Item not found or not owned by user");
  }

  await toDelete.deleteOne();
  return { success: true };
  // return {success: true};
};
////////////////////*******END OF GENERAL ENTITIES METHODS****////////////////////////////////////////
module.exports = {
  connectDB,
  getAllEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
};