import express from "express";
import cors from "cors";
import path from "path";
import { Sequelize, DataTypes, Model } from "sequelize";
import { createSequelizeHandler, watcherEmitter } from "@lensjs/watchers";
import { lens } from "@lensjs/express";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: './database.sqlite',
  benchmark: true,
  logQueryParameters: true,
  // logging: (sql, timing) => {
  //   watcherEmitter.emit("sequelizeQuery", { sql, timing });
  // },
});

// Define User model
class User extends Model {
  declare id: number;
  declare name: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  },
);

// -----------------------------------------------------------------------------
// Express app setup
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Attach Lens middleware
// await lens({
//   app,
//   queryWatcher: {
//     enabled: true,
//     handler: createSequelizeHandler({ provider: "sqlite" }),
//   },
//   isAuthenticated: async () => true,
//   getUser: async () => ({
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//   }),
// });

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
app.get("/", (_req, res) => {
  res.json({ message: "🚀 Express + Sequelize + Lens is running!" });
});

app.post("/users", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const user = await User.create({ name });
  res.status(201).json(user);
});

app.get("/users", async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// -----------------------------------------------------------------------------
// Bootstrap
// -----------------------------------------------------------------------------
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync();
    console.log("✅ Models synchronized");

    app.listen(PORT, () => {
      console.log(`⚡ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
