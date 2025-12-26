import {
    Client,
    GatewayIntentBits,
    Collection,
    Events,
    Interaction
} from 'discord.js'
import { ConvexHttpClient } from '@rbbp/backend'

import { env } from '~/env'
import { commands } from '~/commands'
import type { ExtendedClient } from '~/utils/types'
import { tryCatch } from '~/utils/try-catch'

const convex = new ConvexHttpClient(env.CONVEX_URL)

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
    ]
}) as ExtendedClient

client.commands = new Collection()
client.once(Events.ClientReady, () => {
    for (const command of Object.values(commands)) {
        client.commands.set(command.data.name, command)
    }

    console.log(`Logged in as ${client.user?.tag}!`)
    console.log(`Loaded ${client.commands.size} commands.`)
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    // Return early if the interaction is not a command or autocomplete
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
        return
    }

    const command = client.commands.get(interaction.commandName)
    if (!command) {
        console.error('No command found for ', interaction.commandName)
        return
    }

    if (interaction.isAutocomplete()) {
        if (!command.autocomplete) {
            console.error('Command does not have an autocomplete function')
            return
        }

        const { error } = await tryCatch(command.autocomplete(interaction))

        if (error) {
            console.error(`Error Autocompleting:`, error)
            return
        }

        return
    }

    const { error } = await tryCatch(command.execute(interaction))
    if (error) {
        console.error(`Error Executing ${interaction.commandName}:`, error)
        const errorMessage = {
            content: 'There was an error executing this command!',
            ephemeral: true,
        }

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage)
        } else {
            await interaction.reply(errorMessage)
        }

        return
    }
})

client.login(env.DISCORD_TOKEN)
export { client, convex }
