import express from "express";
import { query } from "./db";

const router = express.Router();

router.get("/colleges", async (req, res) => {
  try {
    const search = (req.query.search as string | undefined)?.trim() || "";
    const location = (req.query.location as string | undefined)?.trim();
    const maxFees = Number(req.query.maxFees ?? 0);
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
    const offset = (page - 1) * limit;

    const filters: string[] = [];
    const params: any[] = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      filters.push(`LOWER(name) LIKE $${params.length}`);
    }

    if (location) {
      params.push(location);
      filters.push(`location = $${params.length}`);
    }

    if (maxFees > 0) {
      params.push(maxFees);
      filters.push(`fees <= $${params.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countQuery = `SELECT COUNT(*) AS total FROM colleges ${whereClause}`;
    const listQuery = `SELECT id, name, location, fees, rating, placement_percent, top_course FROM colleges ${whereClause} ORDER BY rating DESC, fees ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const countResult = await query(countQuery, params);
    const total = Number(countResult.rows[0]?.total ?? 0);

    const rows = await query(listQuery, [...params, limit, offset]);
    res.json({ colleges: rows.rows, meta: { total, page, limit } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

router.get("/colleges/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid college id" });
    }
    const result = await query("SELECT * FROM colleges WHERE id = $1", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch college detail" });
  }
});

router.get("/compare", async (req, res) => {
  try {
    const ids = (req.query.ids as string | undefined)?.split(",").map(Number).filter(Boolean);
    if (!ids?.length) {
      return res.status(400).json({ error: "Provide college ids in query string" });
    }
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(",");
    const result = await query(`SELECT id, name, location, fees, rating, placement_percent, top_course FROM colleges WHERE id IN (${placeholders})`, ids);
    res.json({ colleges: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compare colleges" });
  }
});

router.post("/predict", async (req, res) => {
  try {
    const { exam, rank } = req.body as { exam?: string; rank?: number };
    if (!rank || typeof rank !== "number") {
      return res.status(400).json({ error: "Rank is required and must be a number" });
    }

    let queryText = "SELECT id, name, location, fees, rating, placement_percent, top_course FROM colleges ";
    const params: any[] = [];

    if (rank <= 5000) {
      queryText += "WHERE placement_percent >= 80 AND rating >= 4.2 AND fees <= 120000 ";
    } else if (rank <= 15000) {
      queryText += "WHERE placement_percent >= 70 AND rating >= 3.8 AND fees <= 180000 ";
    } else {
      queryText += "WHERE placement_percent >= 55 AND rating >= 3.4 ";
    }

    if (exam?.toLowerCase() === "jee") {
      queryText += "AND fees <= 250000 ";
    }

    queryText += "ORDER BY placement_percent DESC, rating DESC LIMIT 12";
    const result = await query(queryText, params);
    res.json({ prediction: result.rows, rank, exam: exam || "any" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
});

export default router;
