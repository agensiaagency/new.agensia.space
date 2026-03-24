/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("content_form_responses");
  collection.indexes.push("CREATE INDEX idx_content_form_responses_form_id ON content_form_responses (form_id)");
  collection.indexes.push("CREATE INDEX idx_content_form_responses_user_id ON content_form_responses (user_id)");
  collection.indexes.push("CREATE INDEX idx_content_form_responses_status ON content_form_responses (status)");
  collection.indexes.push("CREATE INDEX idx_content_form_responses_created ON content_form_responses (created)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("content_form_responses");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_form_responses_form_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_form_responses_user_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_form_responses_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_content_form_responses_created"));
  return app.save(collection);
})
