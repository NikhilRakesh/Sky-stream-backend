import fs from "fs";
import path from "path";
// Function to delete a folder recursively
export const deleteFolderRecursive = function (folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        const curStats = fs.lstatSync(curPath);

        if (curStats.isDirectory()) {
          // Recursive call for directories
          deleteFolderRecursive(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });

      // Delete the folder itself
      fs.rmdirSync(folderPath);
    }
  } catch (error) {
    console.error(`Error while processing folder: ${folderPath}`);
    console.error(error);
  }
};