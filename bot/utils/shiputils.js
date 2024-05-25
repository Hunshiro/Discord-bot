/**
 * Calculates the ship percentage between two users based on various factors.
 * @param {string} user1 Username of the first user.
 * @param {string} user2 Username of the second user.
 * @param {string} serverNickname Server nickname (optional).
 * @returns {number} The ship percentage.
 */
function calculateShipPercentage(user1, user2, serverNickname) {
    let combinedNames = user1.toLowerCase() + user2.toLowerCase();
    if (serverNickname) {
      combinedNames += serverNickname.toLowerCase();
    }
    
    let sum = 0;
    for (let i = 0; i < combinedNames.length; i++) {
      sum += combinedNames.charCodeAt(i);
    }
    
    const shipPercentage = Math.round((sum % 101)); // Normalize the sum to be between 0 and 100
    return shipPercentage;
  }
  

/**
 * Determines the ship status based on the ship percentage.
 * @param {number} shipPercentage The ship percentage.
 * @returns {string} The ship status.
 */
function determineShipStatus(shipPercentage) {
  if (shipPercentage >= 90) {
    return "Made for each other ❤️";
  } else if (shipPercentage >= 70) {
    return "Soulmates 💞";
  } else if (shipPercentage >= 50) {
    return "Lovers 💖";
  } else if (shipPercentage >= 30) {
    return "More than friends 💑";
  } else {
    return "Just friends 👫";
  }
}

module.exports = { calculateShipPercentage, determineShipStatus };
