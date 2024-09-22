// Import required modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Pokazuje wszystkie dostępne komendy w bocie.'),

  // Execute function for the command
  async execute(interaction) {
    // Generate random colors for the embed
    const randomColor = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ]

    // Create an embed to display available commands
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle('🛠️ Dostępne komendy')
      .setDescription(
        '**Ogólne:**\n```/botinfo, /help, /ping, /serverinfo, /status, /userinfo```\n\n' +
          '**Moderacyjne:**\n```/clear, /embed, /maintenance, /online```',
      )
      .setTimestamp() // Set the current timestamp
      .setColor(randomColor) // Set the random color

    await interaction.reply({ embeds: [embed] }) // Reply with the embed
  },
}
