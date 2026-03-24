/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notifications");
  collection.listRule = "user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.viewRule = "user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("notifications");
  collection.listRule = "user_id = @request.auth.id";
  collection.viewRule = "user_id = @request.auth.id";
  collection.createRule = "@request.auth.role = \"admin\"";
  return app.save(collection);
})
