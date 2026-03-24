/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("submissions");
  collection.listRule = "@request.auth.isAdmin = true";
  collection.viewRule = "@request.auth.isAdmin = true";
  collection.createRule = "";
  collection.updateRule = "@request.auth.isAdmin = true";
  collection.deleteRule = "@request.auth.isAdmin = true";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("submissions");
  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
  collection.deleteRule = null;
  return app.save(collection);
})