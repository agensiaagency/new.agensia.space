/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("color_group");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("color_group"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "color_group",
    required: false,
    values: ["gr\u00fcn", "rot", "violett", "gelb", "blau", "custom"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("color_group");
  return app.save(collection);
})