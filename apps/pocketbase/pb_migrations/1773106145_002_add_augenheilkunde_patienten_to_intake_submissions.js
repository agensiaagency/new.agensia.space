/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("augenheilkunde_patienten");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("augenheilkunde_patienten"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "augenheilkunde_patienten"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("augenheilkunde_patienten");
  return app.save(collection);
})