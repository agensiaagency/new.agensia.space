/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("architektur_zielgruppe");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("architektur_zielgruppe"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "architektur_zielgruppe"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("architektur_zielgruppe");
  return app.save(collection);
})