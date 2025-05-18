const mongoose = require("mongoose");

const DATABASE_NAME = "NODEJS-STUDYING-2";
const MONGO_URI = `mongodb://127.0.0.1:27017/${DATABASE_NAME}`;


let isConnected = false;

// Initial connection to DB
const connectDB = async () => {

  try {
     mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (e) {
    if (e.name === "MongoServerError" && e.code === 18) {
      console.error("❌ Authentication error: Check URI credentials.");
      throw new Error("Authentication error");
    }
    console.error("❌ Error connecting to MongoDB:", e);
    throw new Error("MongoDB connection error");
  }
};

// Helper: Get or create Mongoose model
const getModel = (entityName, optionalSchema = null) => {
  try {
    return mongoose.model(entityName);
  } catch (err) {
    const schema = optionalSchema || new mongoose.Schema({}, { strict: false });
    return mongoose.model(entityName, schema);
  }
};

// Get all documents
const getAllEntities = async (entityName, optionalSchema = null) => {
  await connectDB();
  const EntityModel = getModel(entityName, optionalSchema);
  return EntityModel.find();
};

// Get a single document by ID
const getEntity = async (entityName, id, optionalSchema = null) => {
  await connectDB();
  const EntityModel = getModel(entityName, optionalSchema);
  return EntityModel.findById(id);
};

// Create a new document
const createEntity = async (data, entityName, optionalSchema = null) => {
  await connectDB();
  const EntityModel = getModel(entityName, optionalSchema);
  const newItem = new EntityModel(data);
  return await newItem.save();
};

// Update a document
const updateEntity = async (data, entityName, optionalSchema = null) => {
  await connectDB();
  const EntityModel = getModel(entityName, optionalSchema);

  try {
    const updated = await EntityModel.findOneAndUpdate(
      { _id: data._id },
      { $set: data },
      { new: true }
    );
    if (!updated) throw new Error(`${entityName} not found`);
    return updated;
  } catch (error) {
    throw error;
  }
};

// Delete a document by ID
const deleteEntity = async (id, entityName, optionalSchema = null) => {
  await connectDB();
  const EntityModel = getModel(entityName, optionalSchema);

  const toDelete = await EntityModel.findById(id);
  if (!toDelete) {
    throw new Error("Item not found or not owned by user");
  }

  await toDelete.deleteOne();
  return { success: true };
};

module.exports = {
  connectDB,
  getAllEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
};
