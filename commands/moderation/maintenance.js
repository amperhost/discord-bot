const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maintenance')
    .setDescription('Tworzy embed z informacjami o przerwie technicznej.')
    .addStringOption((option) =>
      option
        .setName('powód')
        .setDescription('Powód przerwy technicznej')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('koniec')
        .setDescription(
          'Planowany koniec przerwy technicznej. Użyj unixtimestamp.com',
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('usługi')
        .setDescription('Dotknięte usługi')
        .setRequired(true),
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content:
          'Nie masz uprawnień do użycia tej komendy (wymagane: **Administrator**).',
        ephemeral: true,
      })
    }

    const reason = interaction.options.getString('powód')
    const endTimestamp = interaction.options.getInteger('koniec')
    const services = interaction.options.getString('usługi')

    if (endTimestamp < Math.floor(Date.now() / 1000)) {
      return interaction.reply({
        content:
          'Podany timestamp jest w przeszłości. Użyj przyszłego czasu. Możesz wygenerować poprawny timestamp na stronie: https://www.unixtimestamp.com',
        ephemeral: true,
      })
    }

    const embed = new EmbedBuilder()
      .setTitle('Przerwa techniczna')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `
- Powód: **${reason}**
- Planowane zakończenie: <t:${endTimestamp}:R>
- Dotknięte usługi: **${services}**
          `,
      )
      .setTimestamp()
      .setColor([255, 0, 0])

    await interaction.reply({ embeds: [embed] })
  },
}
