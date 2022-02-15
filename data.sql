DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

INSERT INTO users
VALUES
('CoreyJ','jim123','Corey','Jimenez','2813308004',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users
VALUES
('Frank','fpLOL','Frank','Peters','2813308004',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users
VALUES
('Shawm','SHWN505','Shawn','Mendez','2813308004',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


INSERT INTO messages
(from_username,to_username,body,sent_at,read_at)
VALUES
('Frank','Shawm','Whaddup my dude',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO messages
(from_username,to_username,body,sent_at,read_at)
VALUES
('CoreyJ','Shawm','Whaddup my dude',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO messages
(from_username,to_username,body,sent_at,read_at)
VALUES
('Shawm','CoreyJ','Whaddup my dude',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO messages
(from_username,to_username,body,sent_at,read_at)
VALUES
('CoreyJ','Frank','Whaddup my dude',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO messages
(from_username,to_username,body,sent_at,read_at)
VALUES
('Frank','CoreyJ','Whaddup my dude',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
