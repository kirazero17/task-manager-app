// init.js

// Get env
let database = process.env.MONGO_INITDB_DATABASE;

// Create or switch to database
db = db.getSiblingDB(process.env.MONGODB_DATABASE);

// Create collections
db.createCollection("Task");
db.createCollection("Assignment");
db.createCollection("TaskStatus");
db.createCollection("TaskSize");
db.createCollection("TaskPriority");

// Insert some default value
