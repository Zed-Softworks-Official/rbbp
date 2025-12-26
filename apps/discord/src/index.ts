import { Client, GatewayIntentBits } from 'discord.js'
import { env } from '~/env'

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
    ]
})

client.on('ready', () => {
    console.log("Hello, World!")
})

client.login(env.DISCORD_TOKEN)
