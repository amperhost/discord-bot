// Import required modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Pokazuje informacje o serwerze.'),

  // Execute function for the command
  async execute(interaction) {
    const guild = interaction.guild // Get the guild (server) from interaction
    const owner = await guild.fetchOwner() // Fetch the server owner
    const createdTimestamp = Math.floor(guild.createdTimestamp / 1000) // Get server creation timestamp

    // Function to generate a random color
    function generate_color() {
      const random1 = Math.floor(Math.random() * 255)
      const random2 = Math.floor(Math.random() * 255)
      const random3 = Math.floor(Math.random() * 255)
      return [random1, random2, random3] // Return the random RGB values
    }

    // Create an embed with server information
    const embed = new EmbedBuilder()
      .setColor(generate_color()) // Set a random color for the embed
      .setTitle(`Informacje o ${guild.name}`) // Set the title to the server name
      .setThumbnail(guild.iconURL({ dynamic: true })) // Set the server icon as thumbnail
      .addFields(
        {
          name: 'Właściciel',
          value: `${owner.user.tag}`, // Owner's tag
          inline: true,
        },
        { name: 'ID serwera', value: guild.id, inline: true }, // Server ID
        {
          name: 'Serwer utworzony',
          value: `<t:${createdTimestamp}:F>`, // Creation date
          inline: true,
        },
        {
          name: 'Ilość członków',
          value: `${guild.memberCount}`, // Member count
          inline: true,
        },
        {
          name: 'Ilość ról',
          value: `${guild.roles.cache.size}`, // Role count
          inline: true,
        },
        {
          name: 'Ilość kanałów',
          value: `${guild.channels.cache.size}`, // Channel count
          inline: true,
        },
        {
          name: 'Poziom ulepszenia',
          value: `${guild.premiumTier}`, // Premium tier level
          inline: true,
        },
        {
          name: 'Ilość ulepszeń',
          value: `${guild.premiumSubscriptionCount || 0}`, // Number of boosts
          inline: true,
        },
        {
          name: 'Poziom weryfikacji',
          value: `${guild.verificationLevel}`, // Verification level
          inline: true,
        },
      )
      .setFooter({
        text: `Na żądanie ${interaction.user.tag}`, // Footer with requestor's tag
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }), // Requestor's avatar
      })
      .setTimestamp() // Set current timestamp

    // Reply with the embed
    await interaction.reply({ embeds: [embed] })
  },
}
