/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("rechtsanwaelte_rechtsgebiet");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("rechtsanwaelte_rechtsgebiet"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "rechtsanwaelte_rechtsgebiet"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("rechtsanwaelte_rechtsgebiet");
  return app.save(collection);
})