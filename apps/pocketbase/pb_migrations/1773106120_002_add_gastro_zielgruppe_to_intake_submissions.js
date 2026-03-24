/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("gastro_zielgruppe");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("gastro_zielgruppe"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "gastro_zielgruppe"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("gastro_zielgruppe");
  return app.save(collection);
})