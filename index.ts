import express from "express";
import path from "path";
import errorhandler from "./errors/errorhandler";
import apiPostimerkki from "./routes/apiPostimerkit";

const app: express.Application = express();
const port: number = Number(process.env.PORT || 3108);

app.use(express.static(path.resolve(__dirname, "./public")));
app.use("/api/postimerkit", apiPostimerkki);
app.use(errorhandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
