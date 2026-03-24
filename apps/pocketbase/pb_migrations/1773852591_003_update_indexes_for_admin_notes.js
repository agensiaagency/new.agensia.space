/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_notes");
  collection.indexes.push("CREATE INDEX idx_admin_notes_user_id ON admin_notes (user_id)");
  collection.indexes.push("CREATE INDEX idx_admin_notes_admin_id ON admin_notes (admin_id)");
  collection.indexes.push("CREATE INDEX idx_admin_notes_pinned ON admin_notes (pinned)");
  collection.indexes.push("CREATE INDEX idx_admin_notes_created ON admin_notes (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_notes");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_admin_notes_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_admin_notes_admin_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_admin_notes_pinned"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_admin_notes_created"));
  return app.save(collection);
})
