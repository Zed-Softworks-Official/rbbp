import { Client, GatewayIntentBits, Collection } from 'discord.js'

import { env } from '~/env'
import { commands } from '~/commands'
import { registerInteractionHandler } from '~/events/interaction-create'
import type { ExtendedClient } from '~/utils/types'

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
    ]
}) as ExtendedClient

client.commands = new Collection()
Object.entries(commands).forEach(([name, command]) => {
    client.commands.set(name, command)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    console.log(`Loaded ${client.commands.size} commands.`)
})

registerInteractionHandler(client)

client.login(env.DISCORD_TOKEN)
export { client }
