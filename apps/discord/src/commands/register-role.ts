import {
    SlashCommandBuilder,
    CommandInteraction,
    AutocompleteInteraction,
    PermissionFlagsBits,
} from 'discord.js'

import { api } from '@rbbp/backend/api'

import type { Command } from '~/utils/types'
import { tryCatch } from '~/utils/try-catch'

import { convex } from '~/lib/convex'
import { cache } from '~/lib/redis'

export const registerRole: Command = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers a role as "Protected"')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(opt =>
            opt.setName('role')
                .setDescription('Start typing the role name')
                .setAutocomplete(true)
                .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return

        const guildId = interaction.guildId
        if (!guildId) {
            await interaction.reply('This command can only be used in a server.')
            return
        }

        const roleId = interaction.options.getString('role')
        if (!roleId) {
            await interaction.reply('You must provide a role.')
            return
        }

        const role = await interaction.guild?.roles.fetch(roleId)
        if (!role) {
            await interaction.reply('That role does not exist.')
            return
        }

        await convex.mutation(api.roles.addProtectedRole, {
            guildId,
            roleId: role.id,
            roleName: role.name
        })

        await cache(guildId, role.id)

        await interaction.reply(`Role **${role?.name}** registered as protected.`)
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const { error } = await tryCatch((async () => {
            const focused = interaction.options.getFocused() as string

            const roles = await interaction.guild?.roles.fetch()
            if (!roles) return

            const roleArray = [...roles.values()]
            const filtered = roleArray
            .filter(role => role.name.toLowerCase().startsWith(focused.toLowerCase()))
            .slice(0, 25)
            .map(role => ({ name: role.name, value: role.id }))

            await interaction.respond(filtered)
        })())

        if (error) {
            console.error("Autocomplete error:", error)
        }
    }
}

