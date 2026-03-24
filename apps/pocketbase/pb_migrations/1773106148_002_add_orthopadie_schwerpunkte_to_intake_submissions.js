/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("orthopadie_schwerpunkte");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("orthopadie_schwerpunkte"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "orthopadie_schwerpunkte"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("orthopadie_schwerpunkte");
  return app.save(collection);
})