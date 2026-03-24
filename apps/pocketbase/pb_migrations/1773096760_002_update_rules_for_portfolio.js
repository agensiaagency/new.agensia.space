/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("portfolio");
  collection.listRule = "";
  collection.viewRule = "";
  collection.createRule = "@request.auth.isAdmin = true";
  collection.updateRule = "@request.auth.isAdmin = true";
  collection.deleteRule = "@request.auth.isAdmin = true";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("portfolio");
  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
  collection.deleteRule = null;
  return app.save(collection);
})