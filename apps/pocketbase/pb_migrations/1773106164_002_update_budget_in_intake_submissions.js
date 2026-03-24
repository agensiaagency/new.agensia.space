/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  const field = collection.fields.getByName("budget");
  field.values = ["\u20ac500-\u20ac1000", "\u20ac1000-\u20ac2000", "\u20ac2000-\u20ac3000", "Enterprise ab \u20ac3000"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  const field = collection.fields.getByName("budget");
  field.values = ["\u20ac500-\u20ac1000", "\u20ac1000-\u20ac2000", "\u20ac2000-\u20ac3000"];
  return app.save(collection);
})