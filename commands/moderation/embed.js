const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Tworzy embeda z podanymi wartościami.')
    .addStringOption((option) =>
      option.setName('desc').setDescription('Opis embeda').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('title').setDescription('Tytuł embeda').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('footer')
        .setDescription('Footer embeda')
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('color')
        .setDescription('Kolor HEX embeda, np. #ff0000')
        .setRequired(false),
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages,
      )
    ) {
      return interaction.reply({
        content:
          'Nie masz uprawnień do używania tej komendy (wymagane: **Zarządzanie wiadomościami**).',
        ephemeral: true,
      })
    }

    const desc = interaction.options.getString('desc')
    const title = interaction.options.getString('title')
    const footer = interaction.options.getString('footer') || null
    const colorHex = interaction.options.getString('color')

    let embedColor

    if (colorHex) {
      embedColor = colorHex.startsWith('#') ? colorHex.slice(1) : colorHex
    } else {
      const random1 = Math.floor(Math.random() * 255)
      const random2 = Math.floor(Math.random() * 255)
      const random3 = Math.floor(Math.random() * 255)
      embedColor = [random1, random2, random3]
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(desc)
      .setTimestamp()
      .setColor(embedColor)

    if (footer) {
      embed.setFooter({ text: footer })
    }

    await interaction.reply({ embeds: [embed] })
  },
}
