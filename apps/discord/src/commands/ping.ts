import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from '~/utils/types'

export const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('pong')
    }
}

