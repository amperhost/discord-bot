const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('online')
    .setDescription('Tworzy embed z informacją o końcu przerwy technicznej.'),

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
      .setColor([0, 255, 0])

    await interaction.reply({ embeds: [embed] })
  },
}
