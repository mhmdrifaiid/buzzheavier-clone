const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "public/uploads");
const maxAgeHours = 24; // GANTI sesuai kebutuhan
// maxAge dinamis, baca dari .meta file

fs.readdir(uploadDir, (err, files) => {
  if (err) return console.error(err);

  files.forEach((file) => {
    if (file.endsWith(".meta")) {
      const filePath = path.join(uploadDir, file);
      const mainFile = filePath.replace(".meta", "");

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return console.error(err);

        const { uploadedAt, expireAfter } = JSON.parse(data);
        const now = Date.now();

        if (now - uploadedAt > expireAfter) {
          fs.unlink(filePath, () => {});
          fs.unlink(mainFile, () => {
            console.log(`File dihapus: ${mainFile}`);
          });
        }
      });
    }
  });
});