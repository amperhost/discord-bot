const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const net = require('net')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Wyświetla status naszych usług.'),

    async execute(interaction) {
        function checkService(ip, port) {
            return new Promise((resolve, reject) => {
                const socket = new net.Socket()
                const startTime = Date.now()

                socket.setTimeout(2500)

                socket.on('connect', () => {
                    const endTime = Date.now()
                    const responseTime = endTime - startTime
                    socket.destroy()
                    resolve(responseTime)
                })

                socket.on('timeout', () => {
                    socket.destroy()
                    reject(new Error('timeout'))
                })

                socket.on('error', (err) => {
                    reject(err)
                })

                socket.connect(port, ip)
            })
        }

        let desc = ''
        let color = 0x00ff00

        const services = [
            { name: 'Strona WWW', ip: 'amperhost.pl', port: 80, emoji: '- ' },
            { name: 'Panel', ip: 'panel.amperhost.pl', port: 80, emoji: '- ' },
            {
                name: 'Węzeł PL-01',
                ip: 'pl01.amperhost.pl',
                port: 8080,
                emoji: '- ',
            },
        ]

        for (const service of services) {
            try {
                const responseTime = await checkService(
                    service.ip,
                    service.port,
                )
                desc += `${service.emoji} ${service.name}: ✅ Online (${responseTime} ms)\n`
            } catch (error) {
                desc += `${service.emoji} ${service.name}: ❌ - Offline\n`
                color = 0xff0000
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Status usług')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(desc)
            .setTimestamp()
            .setColor(color)
            .setFooter({ text: 'AmperHost - Zawsze do usług!' })

        await interaction.reply({ embeds: [embed] })
    },
}
