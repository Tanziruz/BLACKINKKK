import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// POST /api/admin/upload — upload an image to Cloudinary
// Body: multipart/form-data with a single "file" field
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blackinkkk/products" },
                (err, res) => {
                    if (err || !res) return reject(err ?? new Error("Upload failed"));
                    resolve(res as { secure_url: string });
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: result.secure_url }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
