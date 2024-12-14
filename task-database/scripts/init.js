// init.js

// Get env
let database = "TaskManager";

// Create user
// db.createUser({
//   user: "root",
//   pwd: "letmein12345",
//   roles: [{ role: "root", db: database }],
// });

// Create or switch to database
db = db.getSiblingDB(database);

// Create collections
db.createCollection("Task");
db.createCollection("Assignment");
db.createCollection("TaskStatus");
db.createCollection("TaskSize");
db.createCollection("TaskPriority");

// Insert some default value
db.TaskStatus.insertMany([
  {
    name: "Not Started",
    value: "not_started",
  },
  {
    name: "Considering",
    value: "considering",
  },
  {
    name: "Bug",
    value: "bug",
  },
  {
    name: "Drop",
    value: "Drop",
  },
  {
    name: "Done",
    value: "Done",
  },
  {
    name: "In Process",
    value: "in_process",
  },
]);

db.TaskSize.insertMany([
  {
    name: "Super Extra Small",
    value: "XXS",
  },
  {
    name: "Extra Small",
    value: "XS",
  },
  {
    name: "Small",
    value: "S",
  },
  {
    name: "Medium",
    value: "M",
  },
  {
    name: "Large",
    value: "L",
  },
  {
    name: "Extra Large",
    value: "XL",
  },
  {
    name: "Super Extra Large",
    value: "XXL",
  },
]);

db.TaskPriority.insertMany([
  {
    name: "P0",
    value: "p0",
  },
  {
    name: "P1",
    value: "p1",
  },
  {
    name: "P2",
    value: "p2",
  },
  {
    name: "P3",
    value: "p3",
  },
  {
    name: "P4",
    value: "p4",
  },
]);
