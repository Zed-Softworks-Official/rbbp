import { Interaction } from 'discord.js'

import type { ExtendedClient } from '~/utils/types'
import { tryCatch } from '~/utils/try-catch'

export function registerInteractionHandler(client: ExtendedClient) {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = client.commands.get(interaction.commandName)
        if (!command) {
            console.error('No command found for ', interaction.commandName)
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

}

