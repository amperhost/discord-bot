// Import required modules
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('online')
    .setDescription('Tworzy embed z informacją o końcu przerwy technicznej.'),

  // Execute function for the command
  async execute(interaction) {
    // Check if the user has administrator permissions
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content:
          'Nie masz uprawnień do użycia tej komendy (wymagane: **Administrator**).',
        ephemeral: true, // Reply is only visible to the user
      })
    }

    // Create an embed message
    const embed = new EmbedBuilder()
      .setTitle('Koniec przerwy technicznej!')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        'Przerwa techniczna została zakończona! Wszystkie usługi są znowu online.',
      )
      .setTimestamp()
      .setColor([0, 255, 0]) // Set the embed color to green

    // Send the embed message as a reply
    await interaction.reply({ embeds: [embed] })
  },
}
