const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'src', 'content', 'principles');
const contentDir = path.join(__dirname, 'src', 'content');

async function createLangFolders(destinationDir) {
  // Resolve the absolute path of the destination directory
  const absoluteDestinationDir = path.resolve(destinationDir);

  // Ensure the destination directory is within src/content but not src/content itself
  if (!absoluteDestinationDir.startsWith(contentDir) || absoluteDestinationDir === contentDir) {
    console.error('Error: Destination directory must be within src/content but not src/content itself.');
    process.exit(1);
  }

  try {
    // Check if the destination directory exists
    if (!fs.existsSync(absoluteDestinationDir)) {
      console.error('Error: Destination directory does not exist.');
      process.exit(1);
    }

    // Get all subdirectories in the source directory
    const subdirectories = fs.readdirSync(sourceDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Create the same subdirectories in the destination directory
    for (const subdirectory of subdirectories) {
      const destinationSubdirectory = path.join(absoluteDestinationDir, subdirectory);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(destinationSubdirectory)) {
        await fs.mkdir(destinationSubdirectory);
        console.log(`Created directory ${destinationSubdirectory}`);
      } else {
        console.log(`Directory ${destinationSubdirectory} already exists.`);
      }
    }

    console.log('Language folders created successfully!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Get the destination directory from the command line arguments
const destinationDir = process.argv[2];

if (!destinationDir) {
  console.error('Error: Destination directory argument is missing.');
  console.log('Usage: node create-lang-folders.js <destination>');
  process.exit(1);
}

createLangFolders(destinationDir);
