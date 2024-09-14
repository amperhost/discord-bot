const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { TOKEN, CLIENT_ID } = require('./config.js')

require('dotenv').config()

const commands = []
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
      commands.push(command.data.toJSON())
    } else {
      console.log(
        `[WARNING] W komendze ${filePath} brakuje właściwości "data" lub "execute".`,
      )
    }
  }
}

const rest = new REST().setToken(TOKEN)

;(async () => {
  try {
    console.log(`Rozpoczęto odświeżanie ${commands.length} slash (/) komend.`)

    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })

    console.log(
      `Poprawnie odświeżono ${data.length} slash (/) komend globalnie.`,
    )
  } catch (error) {
    console.error(error)
  }
})()
