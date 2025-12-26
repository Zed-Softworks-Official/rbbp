import { REST, Routes } from 'discord.js'

import { env } from '~/env'
import { tryCatch } from '~/utils/try-catch'
import { commands } from '~/commands'

export async function deployCommands(guildId?: string) {
    const commandsData = Object.values(commands).map((command) =>
        command.data.toJSON()
   )

    if (commandsData.length === 0) {
        console.log('No Commands to Deploy')
        return
    }

    const rest = new REST().setToken(env.DISCORD_TOKEN)

    const { error } = await tryCatch((async () => {
        if (guildId) {
            await rest.put(Routes.applicationGuildCommands(
                env.DISCORD_CLIENT_ID,
                guildId
            ),
            {
                body: commandsData
            })

            console.log('Deployed Commands to Guild: ', guildId)
        } else {
            await rest.put(Routes.applicationCommands(
                env.DISCORD_CLIENT_ID,
            ),
                {
                    body: commandsData
                }
            )

            console.log('Deployed Commands to Global')
        }
    })())

    console.log('Body sent to Discord:', JSON.stringify(commandsData))

    if (error) {
        console.error('Error Deploying Commands:', error)
        throw error
    }
}
