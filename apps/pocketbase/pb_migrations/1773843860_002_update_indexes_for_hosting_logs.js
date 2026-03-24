/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("hosting_logs");
  collection.indexes.push("CREATE INDEX idx_hosting_logs_user_id ON hosting_logs (user_id)");
  collection.indexes.push("CREATE INDEX idx_hosting_logs_type ON hosting_logs (type)");
  collection.indexes.push("CREATE INDEX idx_hosting_logs_created ON hosting_logs (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("hosting_logs");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_hosting_logs_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_hosting_logs_type"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_hosting_logs_created"));
  return app.save(collection);
})
