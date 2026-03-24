/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const _pb_users_auth_Collection = app.findCollectionByNameOrId("_pb_users_auth_");
  const collection = app.findCollectionByNameOrId("intake_submissions");

  const existing = collection.fields.getByName("assigned_admin");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("assigned_admin"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "assigned_admin",
    required: false,
    collectionId: _pb_users_auth_Collection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("intake_submissions");
  collection.fields.removeByName("assigned_admin");
  return app.save(collection);
})