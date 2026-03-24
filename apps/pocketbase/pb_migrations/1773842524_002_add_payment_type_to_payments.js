/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("payments");

  const existing = collection.fields.getByName("payment_type");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("payment_type"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "payment_type",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("payments");
  collection.fields.removeByName("payment_type");
  return app.save(collection);
})
