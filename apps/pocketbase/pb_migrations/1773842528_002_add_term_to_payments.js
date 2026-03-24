/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("payments");

  const existing = collection.fields.getByName("term");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("term"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "term",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("payments");
  collection.fields.removeByName("term");
  return app.save(collection);
})
