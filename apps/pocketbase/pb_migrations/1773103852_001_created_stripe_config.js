/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = \"admin\"",
    "deleteRule": null,
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text1278123634",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
          },
          {
                "hidden": false,
                "id": "url7105131081",
                "name": "package_starter",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url6441201490",
                "name": "package_professional",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url3579115953",
                "name": "package_premium",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url4143079379",
                "name": "hosting_1year",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url5709497601",
                "name": "hosting_2years",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url6559504799",
                "name": "hosting_3years",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url8032214307",
                "name": "revision_1",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url7289793029",
                "name": "revision_3",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "url4004593955",
                "name": "revision_5",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "url",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "autodate4285275689",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate0639682411",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_1048299468",
    "indexes": [],
    "listRule": "@request.auth.role = \"admin\"",
    "name": "stripe_config",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\""
  });

  try {
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("Collection already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1048299468");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})