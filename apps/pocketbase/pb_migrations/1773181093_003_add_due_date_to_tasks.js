/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tasks");

  const existing = collection.fields.getByName("due_date");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("due_date"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "due_date",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.fields.removeByName("due_date");
  return app.save(collection);
})