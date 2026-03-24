/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("hosting_logs");
  collection.listRule = "user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.viewRule = "user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.role = 'admin'";
  collection.updateRule = "user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("hosting_logs");
  collection.listRule = "@request.auth.role = \"admin\" || user_id = @request.auth.id";
  collection.viewRule = "@request.auth.role = \"admin\" || user_id = @request.auth.id";
  collection.createRule = "@request.auth.role = \"admin\"";
  collection.updateRule = "@request.auth.role = \"admin\"";
  collection.deleteRule = "@request.auth.role = \"admin\"";
  return app.save(collection);
})
