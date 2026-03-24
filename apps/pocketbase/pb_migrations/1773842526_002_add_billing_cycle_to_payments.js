/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("payments");

  const existing = collection.fields.getByName("billing_cycle");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("billing_cycle"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "billing_cycle",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("payments");
  collection.fields.removeByName("billing_cycle");
  return app.save(collection);
})
