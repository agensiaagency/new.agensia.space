/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tasks");

  const existing = collection.fields.getByName("priority");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("priority"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "priority",
    required: false,
    values: ["low", "medium", "high"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.fields.removeByName("priority");
  return app.save(collection);
})