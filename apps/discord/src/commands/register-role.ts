import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from '~/utils/types'

export const registerRole: Command = {
    data: new SlashCommandBuilder()
        .setName('register role')
        .setDescription('Replies with pong!'),

    async execute(interaction: CommandInteraction) {

    }
}

