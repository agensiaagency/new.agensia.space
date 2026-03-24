/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("hosting_term");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("hosting_term"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "hosting_term",
    required: false,
    values: ["1J", "2J", "3J"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("hosting_term");
  return app.save(collection);
})