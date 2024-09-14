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
const colors = require('colors')

require('dotenv').config()

const { TOKEN } = require('./config.js')

const client = new Client({
  intents: [
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
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  restTimeOffset: 0,
  failIfNotExists: false,
  allowedMentions: {
    parse: ['roles', 'users', 'everyone'],
    repliedUser: false,
  },
})

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(
        `[WARNING] W komendze ${filePath} brakuje właściwości "data" lub "execute".`,
      )
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`Nie znaleziono komendy: ${interaction.commandName}.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'Wystąpił błąd podczas wykonywania komendy.',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'Wystąpił błąd podczas wykonywania komendy.',
        ephemeral: true,
      })
    }
  }
})

require('./handler')(client)

const activities = [{ name: 'Minecraft', type: ActivityType.Playing }]

let currentActivityIndex = 0

const updateActivity = () => {
  const activity = activities[currentActivityIndex]

  client.user.setPresence({ activities: [activity], status: 'dnd' })
  currentActivityIndex = (currentActivityIndex + 1) % activities.length
}

client.on('ready', () => {
  updateActivity()
  setInterval(updateActivity, 5000)
})

process.on('unhandledRejection', (error) => {
  if (error.code === 10062) return

  console.log(`[ERROR] ${error}`.red)
})

client.login(TOKEN)
