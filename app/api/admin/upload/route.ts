import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

function buildOptimizedCloudinaryUrl(publicId: string) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        throw new Error("CLOUDINARY_CLOUD_NAME is not set.");
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}

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

        const result = await new Promise<{ public_id: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blackinkkk/products" },
                (err, res) => {
                    if (err || !res) return reject(err ?? new Error("Upload failed"));
                    resolve(res as { public_id: string });
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: buildOptimizedCloudinaryUrl(result.public_id) }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
