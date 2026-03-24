/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("revisions");
  collection.indexes.push("CREATE INDEX idx_revisions_user_id ON revisions (user_id)");
  collection.indexes.push("CREATE INDEX idx_revisions_project_id ON revisions (project_id)");
  collection.indexes.push("CREATE INDEX idx_revisions_status ON revisions (status)");
  collection.indexes.push("CREATE INDEX idx_revisions_created ON revisions (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("revisions");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revisions_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revisions_project_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revisions_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revisions_created"));
  return app.save(collection);
})
