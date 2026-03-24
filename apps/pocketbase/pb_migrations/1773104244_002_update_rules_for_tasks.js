/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.listRule = "projectId = @request.auth.id";
  collection.viewRule = "projectId = @request.auth.id";
  collection.createRule = "@request.auth.id != \"\"";
  collection.updateRule = "projectId = @request.auth.id";
  collection.deleteRule = "projectId = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.createRule = "@request.auth.id != ''";
  collection.listRule = "@request.auth.id != ''";
  collection.viewRule = "@request.auth.id != ''";
  collection.updateRule = "@request.auth.id != ''";
  collection.deleteRule = "@request.auth.id != ''";
  return app.save(collection);
})