/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("revision_packages");
  collection.indexes.push("CREATE INDEX idx_revision_packages_user_id ON revision_packages (user_id)");
  collection.indexes.push("CREATE INDEX idx_revision_packages_status ON revision_packages (status)");
  collection.indexes.push("CREATE INDEX idx_revision_packages_created ON revision_packages (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("revision_packages");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_packages_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_packages_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_packages_created"));
  return app.save(collection);
})
