import fs from "fs";

export function cleanupFiles(files = {}) {
  Object.values(files).flat().forEach((file) => {
    try {
      if (file.path) fs.unlinkSync(file.path);
    } catch (err) {
      console.error("Error cleaning up file:", file.path, err);
    }
  });
}
