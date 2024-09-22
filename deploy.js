// Import required modules
const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { TOKEN, CLIENT_ID } = require('./config.js')

// Load environment variables from .env file
require('dotenv').config()

// Array to hold command data
const commands = []
const foldersPath = path.join(__dirname, 'commands')

// Read the command folders
const commandFolders = fs.readdirSync(foldersPath)

// Loop through command folders and load commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js')) // Filter for JavaScript files

  // Loop through each command file
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath) // Require the command module

    // Ensure command file has 'data' and 'execute' properties
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
    } else {
      console.log(
        `[WARNING] The command in ${filePath} is missing "data" or "execute" property.`,
      )
    }
  }
}

// Initialize REST API client with the bot token
const rest = new REST().setToken(TOKEN)

// Asynchronous function to refresh commands
;(async () => {
  try {
    console.log(`Starting to refresh ${commands.length} slash (/) commands.`)

    // Send a PUT request to refresh the commands
    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })

    // Log success message with bold styling
    console.log(`Successfully refreshed ${data.length} slash (/) commands.`)
  } catch (error) {
    console.error(error) // Log error message
  }
})()
