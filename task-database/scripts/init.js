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
instance = db.getSiblingDB(database);

// Create collections
instance.createCollection("Task");
instance.createCollection("Assignment");
instance.createCollection("TaskStatus");
instance.createCollection("TaskSize");
instance.createCollection("TaskPriority");

// Insert some default value
// Insert statuses of task
instance.TaskStatus.insertMany([
  {
    _id: ObjectId("676b6bcac92f87588e567a2b"),
    order: 0,
    name: "Not Started",
    value: "not_started",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
  {
    _id: ObjectId("676b6bcac92f87588e567a2c"),
    order: 1,
    name: "Considering",
    value: "considering",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
  {
    _id: ObjectId("676b6bcac92f87588e567a2d"),
    order: 5,
    name: "Bug",
    value: "bug",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
  {
    _id: ObjectId("676b6bcac92f87588e567a2e"),
    order: 4,
    name: "Drop",
    value: "drop",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
  {
    _id: ObjectId("676b6bcac92f87588e567a2f"),
    order: 3,
    name: "Done",
    value: "done",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
  {
    _id: ObjectId("676b6bcac92f87588e567a30"),
    order: 2,
    name: "In Process",
    value: "in_process",
    createdAt: 1735093701512,
    updatedAt: 1735093701512,
  },
]);

// Insert sizes of task
instance.TaskSize.insertMany([
  {
    _id: ObjectId("676b708c6a2c77e209567a2b"),
    order: 6,
    name: "Super Extra Small",
    value: "xxs",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a2c"),
    order: 5,
    name: "Extra Small",
    value: "xs",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a2d"),
    order: 4,
    name: "Small",
    value: "s",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a2e"),
    order: 3,
    name: "Medium",
    value: "m",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a2f"),
    order: 2,
    name: "Large",
    value: "l",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a30"),
    order: 1,
    name: "Extra Large",
    value: "xl",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a31"),
    order: 0,
    name: "Super Extra Large",
    value: "xxl",
    createdAt: 1735095122530,
    updatedAt: 1735095122530,
  },
]);

// Insert priorities of task
instance.TaskPriority.insertMany([
  {
    _id: ObjectId("676b708c6a2c77e209567a32"),
    order: 0,
    name: "P0",
    value: "p0",
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a33"),
    order: 1,
    name: "P1",
    value: "p1",
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a34"),
    order: 2,
    name: "P2",
    value: "p2",
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a35"),
    order: 3,
    name: "P3",
    value: "p3",
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  },
  {
    _id: ObjectId("676b708c6a2c77e209567a36"),
    order: 4,
    name: "P4",
    value: "p4",
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  },
]);

// You can find user id in `src/identity-database/scripts/init.sql`
let userId = "94859814-c1d3-11ef-bdb5-0242ac160003";

// Create tasks
let tasks = [
  {
    _id: ObjectId("676bb1141510a2551f567a2b"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a32"),
    statusId: ObjectId("676b6bcac92f87588e567a2c"),
    sizeId: ObjectId("676b708c6a2c77e209567a2e"),
    name: "Task Alpha",
    description: "Implement user authentication module.",
    startAt: 1734402915812,
    endAt: 1734489315812,
    createdAt: 1734402915812,
    updatedAt: 1734410000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a2c"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a34"),
    statusId: ObjectId("676b6bcac92f87588e567a2f"),
    sizeId: ObjectId("676b708c6a2c77e209567a2d"),
    name: "Task Beta",
    description: "Fix critical bug in payment processing.",
    startAt: 1734388515812,
    endAt: 1734402915812,
    createdAt: 1734388515812,
    updatedAt: 1734390000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a2d"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a34"),
    statusId: ObjectId("676b6bcac92f87588e567a2b"),
    sizeId: ObjectId("676b708c6a2c77e209567a30"),
    name: "Task Gamma",
    description: "Refactor the analytics pipeline.",
    startAt: 1734364915812,
    endAt: 1734500515812,
    createdAt: 1734364915812,
    updatedAt: 1734400000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a2e"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a33"),
    statusId: ObjectId("676b6bcac92f87588e567a2e"),
    sizeId: ObjectId("676b708c6a2c77e209567a2f"),
    name: "Task Delta",
    description: "Complete migration to AWS Lambda.",
    startAt: 1734304915812,
    endAt: 1734489315812,
    createdAt: 1734304915812,
    updatedAt: 1734310000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a2f"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a36"),
    statusId: ObjectId("676b6bcac92f87588e567a2c"),
    sizeId: ObjectId("676b708c6a2c77e209567a2b"),
    name: "Task Epsilon",
    description: "Research and evaluate new design tools.",
    startAt: 1734402915812,
    endAt: 1734496515812,
    createdAt: 1734402915812,
    updatedAt: 1734450000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a30"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a35"),
    statusId: ObjectId("676b6bcac92f87588e567a2d"),
    sizeId: ObjectId("676b708c6a2c77e209567a31"),
    name: "Task Zeta",
    description: "Develop the marketing landing page.",
    startAt: 1734402915812,
    endAt: 1734556115812,
    createdAt: 1734402915812,
    updatedAt: 1734460000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a31"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a34"),
    statusId: ObjectId("676b6bcac92f87588e567a2f"),
    sizeId: ObjectId("676b708c6a2c77e209567a2d"),
    name: "Task Eta",
    description: "Optimize database queries for performance.",
    startAt: 1734370000000,
    endAt: 1734489315812,
    createdAt: 1734370000000,
    updatedAt: 1734470000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a32"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a33"),
    statusId: ObjectId("676b6bcac92f87588e567a2e"),
    sizeId: ObjectId("676b708c6a2c77e209567a30"),
    name: "Task Theta",
    description: "Write API documentation for version 2.0.",
    startAt: 1734402915812,
    endAt: 1734609315812,
    createdAt: 1734402915812,
    updatedAt: 1734500000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a33"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a32"),
    statusId: ObjectId("676b6bcac92f87588e567a2b"),
    sizeId: ObjectId("676b708c6a2c77e209567a2e"),
    name: "Task Iota",
    description: "Plan Q1 product roadmap.",
    startAt: 1734380000000,
    endAt: 1734556115812,
    createdAt: 1734380000000,
    updatedAt: 1734430000000,
  },
  {
    _id: ObjectId("676bb1141510a2551f567a34"),
    creatorId: "94859814-c1d3-11ef-bdb5-0242ac160003",
    priorityId: ObjectId("676b708c6a2c77e209567a32"),
    statusId: ObjectId("676b6bcac92f87588e567a2c"),
    sizeId: ObjectId("676b708c6a2c77e209567a31"),
    name: "Task Kappa",
    description: "Fix UI alignment issues in mobile view.",
    startAt: 1734402915812,
    endAt: 1734450000000,
    createdAt: 1734402915812,
    updatedAt: 1734440000000,
  },
];
instance.Task.insertMany(tasks);

// Create assignments
let assignments = tasks.map((task) => {
  return {
    taskId: task._id,
    assignees: [userId],
    createdAt: 1735095120921,
    updatedAt: 1735095120921,
  };
});

instance.Assignment.insertMany(assignments);
