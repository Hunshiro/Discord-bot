const fs = require('fs');
const path = require('path');

/**
 * Sets a random background image from the asset folder.
 * @param {string} folderPath The path to the folder containing the assets.
 * @returns {string} The path to the randomly selected background image.
 */
function getRandomBackgroundImage(folderPath) {
  const files = fs.readdirSync(folderPath);
  const randomIndex = Math.floor(Math.random() * files.length);
  const randomFile = files[randomIndex];
  return path.join(folderPath, randomFile);
}

module.exports = {getRandomBackgroundImage};
