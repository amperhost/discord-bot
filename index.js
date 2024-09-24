// Import required modules and libraries
const fs = require('node:fs')
const path = require('node:path')
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
  Partials,
} = require('discord.js')
const { TOKEN } = require('./config.js')

// Load environment variables from .env file
require('dotenv').config()

// Create a new Discord Client instance with specific intents and partials
const client = new Client({
  intents: [
    // List of intents required for the bot to function properly
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    // Partials allow handling incomplete data
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  restTimeOffset: 0, // Reduce REST API latency (default: 0)
  failIfNotExists: false, // Do not throw error if message does not exist
  allowedMentions: {
    // Prevent abuse by limiting mentions
    parse: ['roles', 'users', 'everyone'],
    repliedUser: false, // Avoid notifying the user if replied to
  },
})

// Initialize commands collection
client.commands = new Collection()

// Path to the commands folder
const foldersPath = path.join(__dirname, 'commands')
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
      client.commands.set(command.data.name, command) // Add command to collection
    } else {
      console.log(
        `[WARNING] The command in ${filePath} is missing "data" or "execute" property.`,
      )
    }
  }
}

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return // Ignore non-chat input commands

  const command = client.commands.get(interaction.commandName) // Get the command

  if (!command) return // If command does not exist, exit

  try {
    await command.execute(interaction) // Execute the command
  } catch (error) {
    console.log(`[ERROR] ${error.message}`.red) // Log error message

    // Handle error responses
    const errorMessage = 'An error occurred while executing the command.'
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true })
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true })
    }
  }
})

// Import and initialize additional handlers (if any)
require('./handler')(client)

// Set bot activity (e.g., "Playing Minecraft")
const activities = [{ name: 'Minecraft', type: ActivityType.Playing }]
let currentActivityIndex = 0

// Function to update the bot's activity status periodically
const updateActivity = () => {
  const activity = activities[currentActivityIndex]
  client.user.setPresence({ activities: [activity], status: 'dnd' })
  currentActivityIndex = (currentActivityIndex + 1) % activities.length // Cycle through activities
}

// Event triggered when the bot is ready
client.on('ready', () => {
  updateActivity()
  setInterval(updateActivity, 5000) // Update activity every 5 seconds
})

// Handle unhandled promise rejections (avoid crashing)
process.on('unhandledRejection', (error) => {
  if (error.code === 10062) return // Ignore specific error codes (optional)
  console.log(`[ERROR] ${error.message}`.red) // Log error message
})

client.on('messageCreate', async (message) => {
  try {
    if (message.channelId === REACT_CHANNEL) {
      await message.react('❤️')
    }
  } catch (error) {
    console.error(`[ERROR] ${error.message}`)
  }
})

// Log the bot in using the token from config.js
client.login(TOKEN)
