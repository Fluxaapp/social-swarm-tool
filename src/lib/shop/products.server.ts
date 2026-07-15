import * as fs from "node:fs";
import * as path from "node:path";
import { type Product } from "./products";

// Resolve paths relative to process cwd
const DB_PATH = path.resolve(process.cwd(), "src/lib/shop/db.json");
const LAYOUT_PATH = path.resolve(process.cwd(), "src/lib/shop/layout.json");

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

export interface ShopLayout {
  heroTitle: string;
  heroDescription: string;
  bannerUrl?: string;
  bannerText?: string;
}

export function readLayout(): ShopLayout {
  try {
    if (!fs.existsSync(LAYOUT_PATH)) {
      return {
        heroTitle: "Produtos digitais e serviços com identidade editorial.",
        heroDescription: "Templates, licenças e projetos sob medida criados pelo mesmo cuidado que aplicamos às marcas que atendemos.",
        bannerUrl: "",
        bannerText: ""
      };
    }
    const raw = fs.readFileSync(LAYOUT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading layout.json", error);
    return {
      heroTitle: "Produtos digitais e serviços com identidade editorial.",
      heroDescription: "Templates, licenças e projetos sob medida criados pelo mesmo cuidado que aplicamos às marcas que atendemos."
    };
  }
}

export function writeLayout(layout: ShopLayout): boolean {
  try {
    const dir = path.dirname(LAYOUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LAYOUT_PATH, JSON.stringify(layout, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to layout.json", error);
    return false;
  }
}
