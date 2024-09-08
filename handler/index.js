const { Routes } = require('discord-api-types/v9')
const { REST } = require('@discordjs/rest')
const { readdirSync } = require('fs')
const colors = require('colors')

module.exports = (client) => {
    function loadEvents(dir = './events/') {
        readdirSync(dir).forEach((dirs) => {
            const events = readdirSync(`${dir}/${dirs}`).filter((files) =>
                files.endsWith('.js'),
            )

            for (const file of events) {
                const event = require(`../${dir}/${dirs}/${file}`)
                client.on(event.name, (...args) =>
                    event.execute(...args, client),
                )
                console.log(
                    `[EVENTS]`.bold.red +
                        ` Ładowanie eventu :`.bold.white +
                        ` ${event.name}`.bold.red,
                )
            }
        })
    }

    loadEvents()
    console.log(`•----------•`.bold.black)
}
