/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("design_feedback");
  collection.indexes.push("CREATE INDEX idx_design_feedback_review_id ON design_feedback (review_id)");
  collection.indexes.push("CREATE INDEX idx_design_feedback_user_id ON design_feedback (user_id)");
  collection.indexes.push("CREATE INDEX idx_design_feedback_status ON design_feedback (status)");
  collection.indexes.push("CREATE INDEX idx_design_feedback_created ON design_feedback (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("design_feedback");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_feedback_review_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_feedback_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_feedback_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_design_feedback_created"));
  return app.save(collection);
})
