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
    order: 0,
    name: "Not Started",
    value: "not_started",
  },
  {
    order: 1,
    name: "Considering",
    value: "considering",
  },
  {
    order: 5,
    name: "Bug",
    value: "bug",
  },
  {
    order: 4,
    name: "Drop",
    value: "drop",
  },
  {
    order: 3,
    name: "Done",
    value: "done",
  },
  {
    order: 2,
    name: "In Process",
    value: "in_process",
  },
]);

db.TaskSize.insertMany([
  {
    name: "Super Extra Small",
    value: "xxs",
  },
  {
    name: "Extra Small",
    value: "xs",
  },
  {
    name: "Small",
    value: "s",
  },
  {
    name: "Medium",
    value: "m",
  },
  {
    name: "Large",
    value: "l",
  },
  {
    name: "Extra Large",
    value: "xl",
  },
  {
    name: "Super Extra Large",
    value: "xxl",
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
