/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tasks");

  const existing = collection.fields.getByName("assigned_to");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("assigned_to"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "assigned_to",
    required: false,
    values: ["user", "admin"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.fields.removeByName("assigned_to");
  return app.save(collection);
})