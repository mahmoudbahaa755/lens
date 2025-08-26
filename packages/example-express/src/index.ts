import express from "express";
import cors from "cors";
import { Sequelize, DataTypes, Model } from "sequelize";
import path from "path";
import { AsyncLocalStorage } from "async_hooks";

const app = express();
const router = express.Router();
app.use(
  cors({
    origin: "*",
  }),
);

const port = 3000;

app.use(async (req, res, next) => {
  // context.run({ name: "Elattar" }, () => {
  //   next();
  // });
});

const context = new AsyncLocalStorage<Record<string, any>>();
function logging(sql: string, timing?: number) {}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
  benchmark: true,
  logQueryParameters: true,
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
await sequelize.sync();

// Example route to add user via Sequelize
app.get("/add-user", async (_req, res) => {
  await User.create(
    { name: "John Doe" },
    {
      logging: (sql) => {
        console.log(context.getStore());
      },
    },
  );
  res.send("User added");
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
app.get("/long-add-user", async (_req, res) => {
  await User.create({ name: "John Doe" });

  await sleep(5000);

  return res.send("User added");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
