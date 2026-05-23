import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import collegeRoutes from "./colleges";

dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api", collegeRoutes);

app.get("/", (_req, res) => res.send({ status: "College Discovery API is running" }));

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
