import express from "express";
import { lens } from "@lens/express-adapter";
import cors from "cors";
import { Sequelize, DataTypes, Model } from "sequelize";
import { createSequelizeHandler, watcherEmitter } from "@lens/watcher-handlers";
import path from "path";

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);

const port = 3000;

await lens({
  app,
  requestWatcherEnabled: true,
  handlers: {
    query: {
      enabled: true,
      handler: createSequelizeHandler({ provider: "sqlite" }),
    },
  },
});

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
  benchmark: true,
  logQueryParameters: true,
  logging: (sql: string, timing?: number) => {
    watcherEmitter.emit("sequelizeQuery", {
      sql,
      timing,
    });
  },
});

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

// Sync DB
await sequelize.sync({force: true});

// Example route to add user via Sequelize
app.get("/add-user", async (_req, res) => {
  await User.create({ name: "John Doe" });
  res.send("User added");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
