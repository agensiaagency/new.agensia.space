/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("revision_comments");
  collection.indexes.push("CREATE INDEX idx_revision_comments_revision_id ON revision_comments (revision_id)");
  collection.indexes.push("CREATE INDEX idx_revision_comments_user_id ON revision_comments (user_id)");
  collection.indexes.push("CREATE INDEX idx_revision_comments_created ON revision_comments (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("revision_comments");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_comments_revision_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_comments_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_revision_comments_created"));
  return app.save(collection);
})
