import express from "express";
import cors from "cors";
import { Sequelize, DataTypes, Model } from "sequelize";
import { createSequelizeHandler, watcherEmitter } from "@lensjs/watchers";
import { lens } from "@lensjs/express";

const app = express();
const port = 3000;
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./lens.db",
  benchmark: true,
  logQueryParameters: true,
  logging: (sql, timing) => {
    watcherEmitter.emit("sequelizeQuery", { sql, timing });
  },
});

app.use(
  cors({
    origin: "*",
  }),
);

await lens({
  app,
  queryWatcher: {
    enabled: true,
    handler: createSequelizeHandler({ provider: "sqlite" }),
  },
  isAuthenticated: async (_req) => {
    return true;
  },
  getUser: async (_req) => {
    return {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };
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

await sequelize.sync();

app.get("/add-user", async (_req, res) => {
  await User.create({ name: "John Doe" });
  res.json({ message: "User added successfully" });
});

app.get('/normal-send', async (_req, res) => {
    res.send('Hello World!')
})

app.get("/get-users", async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
