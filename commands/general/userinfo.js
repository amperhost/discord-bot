// Import required modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Wyświetla informacje o użytkowniku.')
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Nazwa użytkownika')
        .setRequired(false),
    ),

  // Execute function for the command
  async execute(interaction) {
    // Get the target user or the command invoker if not specified
    const target = interaction.options.getUser('użytkownik') || interaction.user
    const member = interaction.guild.members.cache.get(target.id) // Fetch the member object

    // Get the roles of the member, sorted by position
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1) // Exclude the @everyone role

    // Create the embed with user information
    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || 0x0099ff) // Set embed color
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
      .setTimestamp() // Set the current timestamp

    // Reply with the embed
    await interaction.reply({ embeds: [embed] })
  },
}
