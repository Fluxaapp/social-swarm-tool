import * as fs from "node:fs";
import * as path from "node:path";
import { type Product } from "./products";

// Resolve DB path relative to the process cwd
const DB_PATH = path.resolve(process.cwd(), "src/lib/shop/db.json");

export function readDb(): Product[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.warn("Database file not found at " + DB_PATH + ", returning empty array.");
      return [];
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading db.json", error);
    return [];
  }
}

export function writeDb(products: Product[]): boolean {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to db.json", error);
    return false;
  }
}
