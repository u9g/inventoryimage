const mineflayer = require('mineflayer')
const Discord = require('discord.js')
const client = new Discord.Client()
const TOKEN = 'token'
const USER_ID = 'userid'
const bot = mineflayer.createBot({ host: 'localhost', username: 'bob' })

bot.once('spawn', async () => {
  setTimeout(async () => {
    const getImage = require('../index.js')
    const image = await getImage(bot)
    const user = await client.users.fetch(USER_ID)
    const dm = await user.createDM()
    const embed = new Discord.MessageEmbed()
      .attachFiles({ name: 'file.png', attachment: image.toBuffer() })
      .setDescription(
        bot.inventory.slots
          .filter(x => x)
          .map(x => `${x.displayName}: ${x.count}`)
      )
      .setColor('GREEN')
    dm.send(embed)
  }, 1000)
})

client.login(TOKEN)
