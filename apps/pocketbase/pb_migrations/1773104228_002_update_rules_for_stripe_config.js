/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("stripe_config");
  collection.listRule = "@request.auth.role = \"admin\"";
  collection.viewRule = "@request.auth.role = \"admin\"";
  collection.createRule = "@request.auth.role = \"admin\"";
  collection.updateRule = "@request.auth.role = \"admin\"";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("stripe_config");
  collection.listRule = "@request.auth.role = \"admin\"";
  collection.viewRule = "@request.auth.role = \"admin\"";
  collection.createRule = "@request.auth.role = \"admin\"";
  collection.updateRule = "@request.auth.role = \"admin\"";
  collection.deleteRule = null;
  return app.save(collection);
})