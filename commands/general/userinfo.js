const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Wyświetla informacje o użytkowniku.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Użytkownik').setRequired(false),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser('target') || interaction.user
    const member = interaction.guild.members.cache.get(target.id)

    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1)

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || 0x0099ff)
      .setTitle(`Informacje o ${target.tag}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Nazwa użytkownika', value: target.tag, inline: true },
        { name: 'ID użytkownika', value: target.id, inline: true },
        {
          name: 'Serwerowy nick',
          value: member.nickname || 'Brak',
          inline: true,
        },
        {
          name: 'Dołączył do serwera',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: 'Utworzył konto',
          value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: 'Bot?',
          value: target.bot ? 'Tak' : 'Nie',
          inline: true,
        },
        {
          name: `Role [${roles.length}]`,
          value: roles.length ? roles.join(', ') : 'Brak',
        },
        {
          name: 'Najwyższa rola',
          value: member.roles.highest.toString(),
          inline: true,
        },
        {
          name: 'Boostuje serwer?',
          value: member.premiumSince
            ? `Od <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
            : 'Nie',
          inline: true,
        },
      )
      .setFooter({
        text: `Na żądanie ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
