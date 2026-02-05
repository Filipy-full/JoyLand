import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const { filename } = await req.json();
  if (!filename) {
    return NextResponse.json({ error: "Nome do arquivo não informado" }, { status: 400 });
  }
  const galeriaPath = path.join(process.cwd(), "public", "galeria", filename);
  try {
    fs.unlinkSync(galeriaPath);
    // Remover do gallery-order.json
    const orderFile = path.join(process.cwd(), "public", "galeria", "gallery-order.json");
    if (fs.existsSync(orderFile)) {
      let order = JSON.parse(fs.readFileSync(orderFile, "utf8"));
      order = order.filter((img: string) => img !== filename);
      fs.writeFileSync(orderFile, JSON.stringify(order, null, 2));
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao remover arquivo" }, { status: 500 });
  }
}
