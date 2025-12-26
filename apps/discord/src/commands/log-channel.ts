import {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
} from 'discord.js'
import { api } from '@rbbp/backend/api'

import { convex } from '~/lib/convex'

import { Command } from '~/utils/types'

export const registerLogChannel: Command = {
    data: new SlashCommandBuilder()
    .setName('log-channel')
    .setDescription('Registers a channel for logging')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addChannelOption((option) =>
        option
        .setName('channel')
        .setDescription('The channel to register')
        .setRequired(true)
    ),

    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return

        const guildId = interaction.guildId
        if (!guildId) {
            await interaction.reply('This command can only be used in a server.')
            return
        }

        const channel = interaction.options.getChannel('channel')
        if (!channel) {
            await interaction.reply('Please provide a channel.')
            return
        }

        await convex.mutation(api.log.setLogChannel, {
            guildId,
            channelId: channel.id,
        })

        await interaction.reply(`Registered channel ${channel.name}`)
    },
}
