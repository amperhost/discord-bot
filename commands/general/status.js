// Import required modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const net = require('net')

module.exports = {
  // Define the command data
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Wyświetla status naszych usług.'),

  // Execute function for the command
  async execute(interaction) {
    // Function to check service status using TCP connection
    function checkService(ip, port) {
      return new Promise((resolve, reject) => {
        const socket = new net.Socket() // Create a new TCP socket
        const startTime = Date.now() // Record the start time

        socket.setTimeout(2500) // Set timeout for the connection

        // Event handler for successful connection
        socket.on('connect', () => {
          const endTime = Date.now() // Record the end time
          const responseTime = endTime - startTime // Calculate response time
          socket.destroy() // Close the socket
          resolve(responseTime) // Resolve the promise with response time
        })

        // Event handler for timeout
        socket.on('timeout', () => {
          socket.destroy() // Close the socket
          reject(new Error('timeout')) // Reject the promise with timeout error
        })

        // Event handler for connection errors
        socket.on('error', (err) => {
          reject(err) // Reject the promise with error
        })

        // Attempt to connect to the specified IP and port
        socket.connect(port, ip)
      })
    }

    let desc = '' // Initialize description for the embed
    let color = 0x00ff00 // Default color (green)

    // Define services to check
    const services = [
      { name: 'Strona WWW', ip: 'amperhost.pl', port: 80 },
      { name: 'Panel', ip: 'dash.amperhost.pl', port: 80 },
      { name: 'Węzeł N1', ip: 'n1.amperhost.pl', port: 8080 },
    ]

    // Check each service
    for (const service of services) {
      try {
        const responseTime = await checkService(service.ip, service.port) // Check the service status
        desc += `- ${service.name}: ✅ Online (${responseTime} ms)\n` // Service is online
      } catch (error) {
        desc += `- ${service.name}: ❌ - Offline\n` // Service is offline
        color = 0xff0000 // Change color to red if any service is offline
      }
    }

    // Create an embed with the service status
    const embed = new EmbedBuilder()
      .setTitle('Status usług')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(desc) // Set the description with service status
      .setTimestamp() // Set the current timestamp
      .setColor(color) // Set the embed color based on service status

    // Reply with the embed
    await interaction.reply({ embeds: [embed] })
  },
}
