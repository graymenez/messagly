const express = require("express");
const router = express.Router();
const db = require("../db");
const Message = require("../models/message");
const User = require("../models/user");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next) => {
  try {
    const result = await Message.get(req.params.id);
    console.log(result);
    return res.json({ message: result });
  } catch (e) {
    return next();
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", async (req, res, next) => {
  try {
    const { from_username, to_username, body } = req.body;
    const result = await new Message.create(from_username, to_username, body);
    return res.json({ message: result });
  } catch (e) {
    return next(e);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async (req, res, next) => {
  const message = await Message.markRead(req.params.id);
  return res.json({ message: message });
});
module.exports = router;
