import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const oldImage = formData.get("oldImage") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (oldImage) {
    try {
      const cleanPath = oldImage.replace(/^\/+/, ""); 
      const deletePath = path.join(process.cwd(), "public", cleanPath);

      await unlink(deletePath);
      console.log("Deleted old image:", deletePath);
    } catch (err) {
      console.log("Old image not found or cannot delete:", err);
    }
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = file.name.toLowerCase();
  const filename = `${Date.now()}-${originalName}`;
  const filepath = path.join(process.cwd(), "public/car-uploads", filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/car-uploads/${filename}`,
  });
}
