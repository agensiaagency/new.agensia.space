/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const pbc_9403003280Collection = app.findCollectionByNameOrId("pbc_9403003280");
  const collection = app.findCollectionByNameOrId("tasks");

  const existing = collection.fields.getByName("project_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("project_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "project_id",
    required: false,
    collectionId: pbc_9403003280Collection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tasks");
  collection.fields.removeByName("project_id");
  return app.save(collection);
})