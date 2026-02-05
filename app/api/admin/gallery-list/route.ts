import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const galeriaPath = path.join(process.cwd(), "public", "galeria");
  const files = fs.readdirSync(galeriaPath)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp|svg|mp4)$/i));
  return NextResponse.json({ images: files });
}
