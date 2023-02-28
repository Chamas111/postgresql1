const express = require("express");
const app = express();
require("dotenv").config();
const { Pool } = require("pg");

const PORT = process.env.PORT || 5000;
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Users and orders api</h1>");
});

app.get("/api/users", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  pool
    .query("SELECT * FROM users WHERE id=$1 ;", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.post("/api/users/", (req, res) => {
  const { first_name, last_name, age } = req.body;

  pool
    .query(
      "INSERT INTO users (first_name, last_name, age) VALUES ($1,$2,$3) RETURNING *",
      [first_name, last_name, age]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, age } = req.body;
  console.log(first_name);
  pool
    .query(
      "UPDATE users SET first_name=$1,last_name=$2,age=$3 WHERE id=$4 RETURNING *;",
      [first_name, last_name, age, id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM users WHERE id=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

////// orders

app.get("/api/orders", (req, res) => {
  pool
    .query("SELECT * FROM orders;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.get("/api/orders/:id", (req, res) => {
  const id = req.params.id;

  pool
    .query("SELECT * FROM orders WHERE id=$1 ;", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        res.status(404).json({ message: "order not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.post("/api/orders/", (req, res) => {
  const { price, date, user_id } = req.body;

  pool
    .query(
      "INSERT INTO orders (price,date, user_id) VALUES ($1,$2,$3) RETURNING *",
      [price, date, user_id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.put("/api/orders/:id", (req, res) => {
  const id = req.params.id;
  const { price, date, user_id } = req.body;

  pool
    .query(
      "UPDATE orders SET price=$1,date=$2,user_id=$3 WHERE id=$4 RETURNING *;",
      [price, date, user_id, id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.delete("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM orders WHERE id=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.listen(PORT, () => console.log(`server is runing on port ${PORT}`));
