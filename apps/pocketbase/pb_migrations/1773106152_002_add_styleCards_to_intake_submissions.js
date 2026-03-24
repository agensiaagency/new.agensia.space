/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("styleCards");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("styleCards"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "styleCards"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("styleCards");
  return app.save(collection);
})