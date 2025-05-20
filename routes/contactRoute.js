const express = require("express");
const router = express.Router();

const contactsController = require("../controllers/contactsController");
const { auth } = require("../util/auth");

router.get("/", auth, contactsController.getContacts);
router.post("/", auth, contactsController.addContact);
router.delete("/:contactName", auth, contactsController.deleteContact);

module.exports = router;