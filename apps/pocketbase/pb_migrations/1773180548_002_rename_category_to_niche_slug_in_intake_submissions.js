/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  const field = collection.fields.getByName("category");
  field.name = "niche_slug";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  const field = collection.fields.getByName("niche_slug");
  field.name = "category";
  return app.save(collection);
})