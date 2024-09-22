// Import required modules
const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js')
const { version: botVersion } = require('../../package.json')
const os = require('os')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Wyświetla informacje o bocie.'),

  // Execute function for the command
  async execute(interaction) {
    const client = interaction.client
    const botUptime = Math.floor(client.uptime / 1000)
    const serverCount = client.guilds.cache.size
    const memberCount = client.users.cache.size

    // Function to generate a random color
    function generate_color() {
      return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
      ]
    }

    // Create an embed to display bot information
    const embed = new EmbedBuilder()
      .setColor(generate_color())
      .setTitle(`🤖 Informacje o ${client.user.username}`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Wersja bota', value: botVersion, inline: false },
        { name: 'Wersja Discord.js', value: `v${version}`, inline: false },
        { name: 'Wersja Node.js', value: process.version, inline: false },
        {
          name: 'Uptime',
          value: `<t:${Math.floor(Date.now() / 1000 - botUptime)}:R>`,
          inline: false,
        },
        {
          name: 'Ilość serwerów',
          value: serverCount.toString(),
          inline: false,
        },
        {
          name: 'Ilość użytkowników',
          value: memberCount.toString(),
          inline: false,
        },
        {
          name: 'Użycie pamięci RAM',
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2,
          )} MB`,
          inline: false,
        },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: false },
      )
      .setFooter({
        text: `Na żądanie ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] }) // Reply with the embed
  },
}
