const { Client, Interaction, PermissionFlagsBits, ActionRowBuilder, SelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const RoleModel = require('../../models/role'); // Assuming you have a Role model

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            return interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
        }

        // Check if user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true,
            });
        }

        try {
            const roles = interaction.guild.roles.cache
                .filter(role => !role.managed)
                .map(role => ({
                    label: role.name,
                    value: role.id,
                }));

            if (!roles.length) {
                return interaction.reply({
                    content: 'There are no roles in this server.',
                    ephemeral: true,
                });
            }

            const roleSelect = new StringSelectMenuBuilder()
                .setCustomId('role_select')
                .setPlaceholder('Select roles...')
                .addOptions(
                    roles
                );

            const row = new ActionRowBuilder()
                .addComponents(roleSelect);

            interaction.reply({
                content: 'Please select roles:',
                ephemeral: true,
                components: [row],
            });

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 15000, // Adjust as needed
            });

            let selectedRoles = [];

            collector.on('collect', async (selectMenuInteraction) => {
                if (selectMenuInteraction.customId === 'role_select') {
                    selectedRoles = selectMenuInteraction.values;
                    // Prompt for amount input
                    interaction.followUp({
                        content: 'Please input the amount for the selected roles:',
                        ephemeral: true,
                    });

                    // Stop the collector for role selection
                    collector.stop();
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({
                        content: 'No roles were selected.',
                        ephemeral: true,
                    });
                }
            });

            const inputCollector = interaction.channel.createMessageCollector({
                filter: (msg) => msg.author.id === interaction.user.id,
                max: 1,
                time: 15000, // Adjust as needed
            });

            inputCollector.on('collect', async (msg) => {
                const selectedAmounts = parseInt(msg.content); // Convert to integer
                // Handle selected amounts
                console.log(selectedRoles, selectedAmounts); // Debugging

                // Example: You can use the selectedRoles and selectedAmounts here
            });

            inputCollector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({
                        content: 'No amount was provided.',
                        ephemeral: true,
                    });
                }
            });

        } catch (error) {
            console.error('Error fetching roles:', error);
            interaction.reply({
                content: 'An error occurred while fetching roles.',
                ephemeral: true,
            });
        }
    },

    name: 'create-shop',
    description: "Add roles to the shop with their respective amounts.",
};
