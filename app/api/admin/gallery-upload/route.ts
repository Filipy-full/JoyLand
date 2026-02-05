import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("[UPLOAD] Iniciando upload...");
    const data = await req.formData();
    const file = data.get("file") as File;
    if (!file) {
      console.log("[UPLOAD] Nenhum arquivo recebido.");
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    console.log(`[UPLOAD] Recebido arquivo: ${file.name}, tamanho: ${file.size}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    const galeriaPath = path.join(process.cwd(), "public", "galeria", file.name);
    fs.writeFileSync(galeriaPath, buffer);
    console.log(`[UPLOAD] Arquivo salvo em: ${galeriaPath}`);

    // Adiciona o nome ao gallery-order.json
    const orderFile = path.join(process.cwd(), "public", "galeria", "gallery-order.json");
    let order: string[] = [];
    if (fs.existsSync(orderFile)) {
      order = JSON.parse(fs.readFileSync(orderFile, "utf8"));
      console.log(`[UPLOAD] gallery-order.json lido, itens: ${order.length}`);
    }
    if (!order.includes(file.name)) {
      order.push(file.name);
      fs.writeFileSync(orderFile, JSON.stringify(order, null, 2));
      console.log(`[UPLOAD] Nome adicionado ao gallery-order.json.`);
    }

    console.log(`[UPLOAD] Upload finalizado com sucesso.`);
    return NextResponse.json({ success: true, filename: file.name });
  } catch (err) {
    console.error("[UPLOAD] Erro interno:", err);
    return NextResponse.json({ error: "Erro interno ao salvar imagem" }, { status: 500 });
  }
}
