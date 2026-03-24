/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("immobilien_leistungen");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("immobilien_leistungen"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "immobilien_leistungen"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("immobilien_leistungen");
  return app.save(collection);
})