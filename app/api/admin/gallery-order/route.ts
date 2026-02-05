import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const orderFile = path.join(process.cwd(), "public", "galeria", "gallery-order.json");
const galeriaPath = path.join(process.cwd(), "public", "galeria");

export async function GET() {
  let order: string[] = [];
  if (fs.existsSync(orderFile)) {
    order = JSON.parse(fs.readFileSync(orderFile, "utf8"));
  }
  // Garante que todos os arquivos da pasta estejam na lista
  const files = fs.readdirSync(galeriaPath)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp|svg|mp4)$/i));
  // Adiciona arquivos novos ao final
  const allImages = [...order.filter(f => files.includes(f)), ...files.filter(f => !order.includes(f))];
  return NextResponse.json({ images: allImages });
}

export async function POST(req: Request) {
  const { images } = await req.json();
  if (!Array.isArray(images)) {
    return NextResponse.json({ error: "Lista inválida" }, { status: 400 });
  }
  fs.writeFileSync(orderFile, JSON.stringify(images, null, 2));
  return NextResponse.json({ success: true });
}
