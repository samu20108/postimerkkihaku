import express from "express";
import { CustomError } from "../errors/errorhandler";
import { Prisma, PrismaClient } from "@prisma/client";

const apiPostimerkitRouter: express.Router = express.Router();
apiPostimerkitRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiPostimerkitRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (
        typeof req.query.hakusana === "string" &&
        String(req.query.hakusana).length >= 2
      ) {
        let hakusana: string = `% ${req.query.hakusana} %`;
        let hakukohde: string = `${req.query.hakukohde}`;
        let alkuvuosi: string = `${req.query.alkuvuosi}`;
        let loppuvuosi: string = `${req.query.loppuvuosi}`;
        if (hakukohde === "merkinNimi") {
          const result =
            await prisma.$queryRaw`SELECT * FROM Postimerkki WHERE merkinNimi LIKE ${hakusana} AND YEAR(STR_TO_DATE(ilmestymispaiva, "%m.%d.%Y %H:%i:%s")) BETWEEN ${alkuvuosi} AND ${loppuvuosi} LIMIT 41`;
          res.json(result);
        } else if (hakukohde === "asiasanat") {
          const result =
            await prisma.$queryRaw`SELECT * FROM Postimerkki WHERE asiasanat LIKE ${hakusana} AND YEAR(STR_TO_DATE(ilmestymispaiva, "%m.%d.%Y %H:%i:%s")) BETWEEN ${alkuvuosi} AND ${loppuvuosi} LIMIT 41`;
          res.json(result);
        } else if (hakukohde === "taiteilija") {
          const result =
            await prisma.$queryRaw`SELECT * FROM Postimerkki WHERE taiteilija LIKE ${hakusana} AND YEAR(STR_TO_DATE(ilmestymispaiva, "%m.%d.%Y %H:%i:%s")) BETWEEN ${alkuvuosi} AND ${loppuvuosi} LIMIT 41`;
          res.json(result);
        } else {
          res.json(new CustomError(404));
        }
      }
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiPostimerkitRouter;
