import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file[0];
    const filePath = file.filepath;

    // Simpan waktu upload ke file .meta
    const metaPath = filePath + ".meta";
    const expire = parseInt(fields.expireAfter?.[0] || "24") * 60 * 60 * 1000;
    fs.writeFileSync(metaPath, JSON.stringify({ uploadedAt: Date.now(), expireAfter: expire }));

    const fileUrl = `/uploads/${path.basename(file.filepath)}`;
    return res.status(200).json({ url: fileUrl });
  });
}