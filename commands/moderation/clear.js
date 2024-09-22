// Import required modules
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')

module.exports = {
  // Set cooldown for the command
  cooldown: 5,

  // Define the command data
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Usuwa wiadomości z kanału.')
    .addIntegerOption((option) =>
      option
        .setName('ilość')
        .setDescription('Ilość wiadomości do usunięcia')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require Manage Messages permission
    .setDMPermission(false), // Disable DM permissions

  // Execute function for the command
  async execute(interaction) {
    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content:
          'Nie masz uprawnień do używania tej komendy (wymagane: **Zarządzanie wiadomościami**).',
        ephemeral: true, // Reply is only visible to the user
      })
    }

    const { options, channel } = interaction
    const amountMessagesToDelete = options.getInteger('ilość') // Get the number of messages to delete

    // Send an initial reply indicating the start of the deletion process
    await interaction.reply({
      content: `Rozpoczynam usuwanie **${amountMessagesToDelete}** wiadomości.`,
      ephemeral: true,
    })

    try {
      // Attempt to delete the specified number of messages
      const messages = await channel.bulkDelete(amountMessagesToDelete, true)
      await interaction.editReply(`Usunięto **${messages.size}** wiadomości.`) // Reply with the number of messages deleted
    } catch (error) {
      console.error(error) // Log any errors
      await interaction.editReply('Wystąpił błąd podczas usuwania wiadomości.') // Notify the user of an error
    }
  },
}
