require('dotenv').config()

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  TICKET_CHANNEL: process.env.TICKET_CHANNEL,
  TICKET_CATEGORY: process.env.TICKET_CATEGORY,
  TICKET_LOGS: process.env.TICKET_LOGS,
  SUPPORT_TEAM: process.env.SUPPORT_TEAM,
  BLACKLIST_ROLE: process.env.BLACKLIST_ROLE,
}
