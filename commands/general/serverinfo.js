const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Pokazuje informacje o serwerze.'),
  async execute(interaction) {
    const guild = interaction.guild
    const owner = await guild.fetchOwner()
    const createdTimestamp = Math.floor(guild.createdTimestamp / 1000)

    function generate_color() {
      const random1 = Math.floor(Math.random() * 255)
      const random2 = Math.floor(Math.random() * 255)
      const random3 = Math.floor(Math.random() * 255)

      return [random1, random2, random3]
    }

    const embed = new EmbedBuilder()
      .setColor(generate_color())
      .setTitle(`Informacje o ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: 'Właściciel',
          value: `${owner.user.tag}`,
          inline: true,
        },
        { name: 'Serwer ID', value: guild.id, inline: true },
        {
          name: 'Serwer utworzony',
          value: `<t:${createdTimestamp}:F>`,
          inline: true,
        },
        {
          name: 'Ilość członków',
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: 'Ilość ról',
          value: `${guild.roles.cache.size}`,
          inline: true,
        },
        {
          name: 'Ilość kanałów',
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: 'Poziom ulepszenia',
          value: `${guild.premiumTier}`,
          inline: true,
        },
        {
          name: 'Ilość ulepszeń',
          value: `${guild.premiumSubscriptionCount || 0}`,
          inline: true,
        },
        {
          name: 'Poziom weryfikacji',
          value: `${guild.verificationLevel}`,
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
