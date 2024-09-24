require('dotenv').config()

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GITHUB_CHANNEL: process.env.GITHUB_CHANNEL,
  TICKET_CHANNEL: process.env.TICKET_CHANNEL,
  TICKET_CATEGORY: process.env.TICKET_CATEGORY,
  TICKET_LOGS: process.env.TICKET_LOGS,
  SUPPORT_TEAM: process.env.SUPPORT_TEAM,
  BLACKLIST_ROLE: process.env.BLACKLIST_ROLE,
  REACT_CHANNEL: process.env.REACT_CHANNEL,
}
