const express = require("express");
const { DB_URI } = require("../config");
const User = require("../models/user");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async (req, res, next) => {
  try {
    const users = await User.all();
    console.log(users);

    if (users.length === 0) {
      throw new ExpressError("No users found", 404);
    }
    return res.json(users);
  } catch (e) {
    next(e);
  }
});
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", async (req, res, next) => {
  try {
    const toMessage = await User.messagesTo(req.params.username);
    return res.json(toMessage);
  } catch (e) {
    return next(e);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", async (req, res, next) => {
  try {
    const result = await User.messagesFrom(req.params.username);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
