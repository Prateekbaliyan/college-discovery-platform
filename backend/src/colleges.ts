import express from "express";
import fs from "fs";
import path from "path";
import { query } from "./db";

const router = express.Router();

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percent: number;
  courses: string[];
  overview: string;
  top_course: string;
  review_summary: string;
};

const listFields = (college: College) => ({
  id: college.id,
  name: college.name,
  location: college.location,
  fees: college.fees,
  rating: college.rating,
  placement_percent: college.placement_percent,
  top_course: college.top_course,
});

let cachedColleges: College[] | null = null;

function getSeedColleges() {
  if (!cachedColleges) {
    const filePath = path.join(process.cwd(), "data", "colleges.json");
    const colleges = JSON.parse(fs.readFileSync(filePath, "utf8")) as Omit<College, "id">[];
    cachedColleges = colleges.map((college, index) => ({ id: index + 1, ...college }));
  }

  return cachedColleges;
}

function getFilteredColleges(search: string, location: string | undefined, maxFees: number) {
  return getSeedColleges()
    .filter((college) => !search || college.name.toLowerCase().includes(search.toLowerCase()))
    .filter((college) => !location || college.location === location)
    .filter((college) => maxFees <= 0 || college.fees <= maxFees)
    .sort((a, b) => b.rating - a.rating || a.fees - b.fees);
}

router.get("/colleges", async (req, res) => {
  const search = (req.query.search as string | undefined)?.trim() || "";
  const location = (req.query.location as string | undefined)?.trim();
  const maxFees = Number(req.query.maxFees ?? 0);
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
  const offset = (page - 1) * limit;

  try {
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
    console.warn("Database unavailable, serving colleges from JSON seed data.", error);
    const filtered = getFilteredColleges(search, location, maxFees);
    const colleges = filtered.slice(offset, offset + limit).map(listFields);
    res.json({ colleges, meta: { total: filtered.length, page, limit } });
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
    console.warn("Database unavailable, serving college detail from JSON seed data.", error);
    const id = Number(req.params.id);
    const college = getSeedColleges().find((item) => item.id === id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json(college);
  }
});

router.get("/compare", async (req, res) => {
  const ids = (req.query.ids as string | undefined)?.split(",").map(Number).filter(Boolean);
  if (!ids?.length) {
    return res.status(400).json({ error: "Provide college ids in query string" });
  }

  try {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(",");
    const result = await query(`SELECT id, name, location, fees, rating, placement_percent, top_course FROM colleges WHERE id IN (${placeholders})`, ids);
    res.json({ colleges: result.rows });
  } catch (error) {
    console.warn("Database unavailable, serving comparison from JSON seed data.", error);
    const colleges = getSeedColleges().filter((college) => ids.includes(college.id)).map(listFields);
    res.json({ colleges });
  }
});

router.post("/predict", async (req, res) => {
  const { exam, rank } = req.body as { exam?: string; rank?: number };
  if (!rank || typeof rank !== "number") {
    return res.status(400).json({ error: "Rank is required and must be a number" });
  }

  try {
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
    console.warn("Database unavailable, serving prediction from JSON seed data.", error);
    const prediction = getSeedColleges()
      .filter((college) => {
        if (rank <= 5000) {
          return college.placement_percent >= 80 && college.rating >= 4.2 && college.fees <= 120000;
        }
        if (rank <= 15000) {
          return college.placement_percent >= 70 && college.rating >= 3.8 && college.fees <= 180000;
        }
        return college.placement_percent >= 55 && college.rating >= 3.4;
      })
      .filter((college) => exam?.toLowerCase() !== "jee" || college.fees <= 250000)
      .sort((a, b) => b.placement_percent - a.placement_percent || b.rating - a.rating)
      .slice(0, 12)
      .map(listFields);

    res.json({ prediction, rank, exam: exam || "any" });
  }
});

export default router;
