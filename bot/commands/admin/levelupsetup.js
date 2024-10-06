const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const LevelUpRewardSchema = require('../../models/levelupreward'); // Adjust path as needed

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      if (!interaction.inGuild()) {
        await interaction.reply({
          content: 'You can only run this command inside a server.',
          ephemeral: true,
        });
        return;
      }

      // Check if the user has admin permissions
      const hasAdminPerms = interaction.member.permissions.has('ADMINISTRATOR');
      if (!hasAdminPerms) {
        await interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'setup') {
        const level = interaction.options.getInteger('level');
        const role = interaction.options.getRole('role');
        const message = interaction.options.getString('message');

        // Fetch or create the document for this guild
        const guildData = await LevelUpRewardSchema.findOne({ guildId: interaction.guild.id });

        if (!guildData) {
          await new LevelUpRewardSchema({
            guildId: interaction.guild.id,
            rewards: [{ level, roleId: role.id, message }],
          }).save();
        } else {
          // Update rewards array
          const existingRewardIndex = guildData.rewards.findIndex(reward => reward.level === level);
          if (existingRewardIndex >= 0) {
            guildData.rewards[existingRewardIndex] = { level, roleId: role.id, message };
          } else {
            guildData.rewards.push({ level, roleId: role.id, message });
          }

          await guildData.save();
        }

        await interaction.reply({
          content: `Level-up reward set up successfully!\nLevel: ${level}\nRole: ${role}\nMessage: ${message}`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('Error with /levelup-reward command:', error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      });
    }
  },

  name: 'levelup-reward',
  description: 'Set up level-up rewards for users',
  options: [
    {
      name: 'setup',
      description: 'Set up a level-up reward',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'level',
          description: 'The level at which the reward is given',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: 'role',
          description: 'The role to assign as a reward',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: 'message',
          description: 'The message to send when the user receives the role',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};
