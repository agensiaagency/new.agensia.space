/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let collection = new Collection({
        type: "auth",
        name: "users",
        listRule: "@request.auth.id != \"\" && (@request.auth.id = id || @request.auth.role = \"admin\")",
        viewRule: "@request.auth.id != \"\" && (@request.auth.id = id || @request.auth.role = \"admin\")",
        createRule: "",
        updateRule: "@request.auth.id = id || @request.auth.role = \"admin\"",
        deleteRule: "@request.auth.role = \"admin\"",
        fields: [
        {
                "hidden": false,
                "id": "select7036832268",
                "name": "role",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "user",
                        "admin"
                ]
        },
        {
                "hidden": false,
                "id": "text5117401040",
                "name": "company_name",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
        },
        {
                "hidden": false,
                "id": "text4158415185",
                "name": "phone",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
        },
        {
                "hidden": false,
                "id": "text9007658834",
                "name": "avatar_url",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
        },
        {
                "hidden": false,
                "id": "select7578413002",
                "name": "selected_package",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "starter",
                        "professional",
                        "premium"
                ]
        },
        {
                "hidden": false,
                "id": "bool3217213515",
                "name": "onboarding_complete",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "bool"
        }
],
    })

    try {
        app.save(collection)
    } catch (e) {
        if (e.message.includes("Collection name must be unique")) {
            console.log("Collection already exists, skipping")
            return
        }
        throw e
    }
}, (app) => {
    try {
        let collection = app.findCollectionByNameOrId("users")
        app.delete(collection)
    } catch (e) {
        if (e.message.includes("no rows in result set")) {
            console.log("Collection not found, skipping revert");
            return;
        }
        throw e;
    }
})