// Import required modules
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Tworzy embeda z podanymi wartościami.')
    .addStringOption((option) =>
      option.setName('opis').setDescription('Opis embeda').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('tytuł').setDescription('Tytuł embeda').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('stopka')
        .setDescription('Stopka embeda')
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('kolor')
        .setDescription('Kolor HEX embeda, np. #ff0000')
        .setRequired(false),
    ),

  // Execute function for the command
  async execute(interaction) {
    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages,
      )
    ) {
      return interaction.reply({
        content:
          'Nie masz uprawnień do używania tej komendy (wymagane: **Zarządzanie wiadomościami**).',
        ephemeral: true, // Reply is only visible to the user
      })
    }

    // Retrieve options from the interaction
    const desc = interaction.options.getString('opis')
    const title = interaction.options.getString('tytuł')
    const footer = interaction.options.getString('stopka') || null
    const colorHex = interaction.options.getString('kolor')

    let embedColor

    // Determine the embed color
    if (colorHex) {
      embedColor = colorHex.startsWith('#') ? colorHex.slice(1) : colorHex
    } else {
      const random1 = Math.floor(Math.random() * 255)
      const random2 = Math.floor(Math.random() * 255)
      const random3 = Math.floor(Math.random() * 255)
      embedColor = [random1, random2, random3]
    }

    // Create the embed message
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(desc)
      .setTimestamp()
      .setColor(embedColor)

    // Set the footer if provided
    if (footer) {
      embed.setFooter({ text: footer })
    }

    // Send the embed message as a reply
    await interaction.reply({ embeds: [embed] })
  },
}
