// Import required modules
const { readdirSync } = require('fs')
const { Routes } = require('discord-api-types/v9')
const { REST } = require('@discordjs/rest')

// Export a function that takes the client as an argument
module.exports = (client) => {
  // Function to load events from the specified directory
  function loadEvents(dir = './events/') {
    // Read the directory and loop through its subdirectories
    readdirSync(dir).forEach((subDir) => {
      const eventFiles = readdirSync(`${dir}/${subDir}`).filter(
        (file) => file.endsWith('.js'), // Filter for JavaScript files
      )

      // Loop through each event file
      for (const file of eventFiles) {
        const event = require(`../${dir}/${subDir}/${file}`) // Require the event module

        // Set up an event listener for the event
        client.on(event.name, (...args) => event.execute(...args, client))

        // Log loading event message with styles
        console.log(
          `[EVENTS]`.bold.red +
            ` Loading event :`.bold.white +
            ` ${event.name}`.bold.red,
        )
      }
    })
  }

  // Call the loadEvents function to load all events
  loadEvents()
  console.log(`•----------•`.bold.black) // Log a separator line
}
