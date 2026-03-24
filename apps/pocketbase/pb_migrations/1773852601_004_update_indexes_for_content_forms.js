/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("content_forms");
  collection.indexes.push("CREATE INDEX idx_content_forms_user_id ON content_forms (user_id)");
  collection.indexes.push("CREATE INDEX idx_content_forms_project_id ON content_forms (project_id)");
  collection.indexes.push("CREATE INDEX idx_content_forms_status ON content_forms (status)");
  collection.indexes.push("CREATE INDEX idx_content_forms_created ON content_forms (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("content_forms");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_forms_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_forms_project_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_forms_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_forms_created"));
  return app.save(collection);
})
