/** User class for message.ly */

const { DB_URI } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");
const { use } = require("../app");

/** User of the site. */
function notFound() {
  throw new ExpressError("User not found", 404);
}

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError("Missing Data", 400);
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const results = await db.query(
      "INSERT INTO users VALUES ($1,$2,$3,$4,$5,current_timestamp,current_timestamp) RETURNING username,password,first_name,last_name,phone",
      [username, hashedPwd, first_name, last_name, phone]
    );
    return results.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    if (!password || !username) {
      throw new ExpressError("Incorrect username/password", 400);
    }
    const results = await db.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );
    const user = results.rows[0];
    return user && (await bcrypt.compare(password, user.password));
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(
      "UPDATE users SET last_login_at=CURRENT_TIMESTAMP WHERE username = $1",
      [username]
    );
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(
      "SELECT username,first_name,last_name,phone FROM users"
    );
    if (results.rows.length === 0) {
      notFound();
    }
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT username,first_name,last_name,phone,join_at,last_login_at FROM users WHERE username = $1`,
      [username]
    );
    if (results.rows.length === 0) {
      throw new ExpressError("Incorrect username/password", 400);
    }
    return results.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      "SELECT m.id,m.to_username,m.body,m.sent_at,m.read_at,u.username,u.first_name,u.last_name,u.phone FROM messages AS m LEFT JOIN users AS u ON to_username = u.username WHERE from_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      notFound();
    }
    const fRestults = result.rows.map((r) => ({
      id: r.id,
      to_user: {
        username: r.to_username,
        first_name: r.first_name,
        last_name: r.last_name,
        phone: r.phone,
      },
      body: r.body,
      sent_at: r.sent_at,
      read_at: r.read_at,
    }));
    return fRestults;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(
      "SELECT m.id,m.from_username,m.body,m.sent_at,m.read_at,u.username,u.first_name,u.last_name,u.phone FROM messages AS m LEFT JOIN users AS u ON from_username = u.username WHERE to_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      notFound();
    }
    const fRestults = result.rows.map((r) => ({
      id: r.id,
      from_user: {
        username: r.from_username,
        first_name: r.first_name,
        last_name: r.last_name,
        phone: r.phone,
      },
      body: r.body,
      sent_at: r.sent_at,
      read_at: r.read_at,
    }));
    return fRestults;
  }
}

module.exports = User;
