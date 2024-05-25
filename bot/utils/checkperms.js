const { PermissionFlagsBits } = require('discord.js');

async function checkUserPerms(interaction) {
  const member = interaction.member;

  // Check if the member has the Administrator permission
  if (member.permissions.has(PermissionFlagsBits.Administrator)) {
    return true;
  } else {
    return false;
  }
}

module.exports = { checkUserPerms };
