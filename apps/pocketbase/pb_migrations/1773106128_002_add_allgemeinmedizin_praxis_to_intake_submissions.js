/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("allgemeinmedizin_praxis");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("allgemeinmedizin_praxis"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "allgemeinmedizin_praxis"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("allgemeinmedizin_praxis");
  return app.save(collection);
})