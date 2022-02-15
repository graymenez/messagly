const express = require("express");
const ExpressError = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
  try {
    const results = await User.get(req.body.username);
    const authUser = await User.authenticate(
      results.username,
      req.body.password
    );
    if (!authUser) {
      throw new ExpressError("Incorrect username/password", 400);
    }

    if (authUser) {
      const token = jwt.sign({ username: results.username }, SECRET_KEY);
      return res.json({ username: results.username, token: token });
    }
  } catch (e) {
    return next(e);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const newUser = await User.register({
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
      phone: phone,
    });
    const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
    return res.json({ username: newUser.username, token: token });
  } catch (e) {
    if (e.code === "23505") {
      const err = new ExpressError("User exists", 400);
      return next(err);
    }
    next(e);
  }
});

module.exports = router;
