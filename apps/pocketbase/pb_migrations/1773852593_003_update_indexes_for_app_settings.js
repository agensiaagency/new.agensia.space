/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("app_settings");
  collection.indexes.push("CREATE UNIQUE INDEX idx_app_settings_key ON app_settings (key)");
  collection.indexes.push("CREATE INDEX idx_app_settings_category ON app_settings (category)");
  collection.indexes.push("CREATE INDEX idx_app_settings_updated ON app_settings (updated)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("app_settings");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_app_settings_key"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_app_settings_category"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_app_settings_updated"));
  return app.save(collection);
})
