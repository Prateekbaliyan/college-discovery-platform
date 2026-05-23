import { query } from "./db";

const colleges = require("../data/colleges.json");

async function seed() {
  await query(`
    CREATE TABLE IF NOT EXISTS colleges (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      fees INTEGER NOT NULL,
      rating NUMERIC(2,1) NOT NULL,
      placement_percent INTEGER NOT NULL,
      courses TEXT[] NOT NULL,
      overview TEXT NOT NULL,
      top_course TEXT NOT NULL,
      review_summary TEXT NOT NULL
    )
  `);

  await query("TRUNCATE TABLE colleges RESTART IDENTITY CASCADE");

  for (const college of colleges) {
    await query(
      `INSERT INTO colleges (name, location, fees, rating, placement_percent, courses, overview, top_course, review_summary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        college.name,
        college.location,
        college.fees,
        college.rating,
        college.placement_percent,
        college.courses,
        college.overview,
        college.top_course,
        college.review_summary,
      ]
    );
  }

  console.log(`Seeded ${colleges.length} colleges`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
