/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("design_reviews");
  collection.indexes.push("CREATE INDEX idx_design_reviews_project_id ON design_reviews (project_id)");
  collection.indexes.push("CREATE INDEX idx_design_reviews_user_id ON design_reviews (user_id)");
  collection.indexes.push("CREATE INDEX idx_design_reviews_status ON design_reviews (status)");
  collection.indexes.push("CREATE INDEX idx_design_reviews_created ON design_reviews (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("design_reviews");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_reviews_project_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_reviews_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_reviews_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_reviews_created"));
  return app.save(collection);
})
