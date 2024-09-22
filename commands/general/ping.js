// Import required modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdza opóźnienie bota.'),

  // Execute function for the command
  async execute(interaction) {
    await interaction.deferReply() // Defer the reply to allow processing time
    const reply = await interaction.fetchReply() // Fetch the reply message
    const ping = reply.createdTimestamp - interaction.createdTimestamp // Calculate the ping

    // Generate a random color for the embed
    const randomColor = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ]

    // Create embed
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle('🏓 pong!') // Add title
      .setDescription(
        `Client: **${ping}ms** | Websocket: **${interaction.client.ws.ping}ms**`,
      )
      .setTimestamp() // Set the current timestamp
      .setColor(randomColor) // Set the random color

    await interaction.editReply({ embeds: [embed] }) // Edit the deferred reply with the embed
  },
}
