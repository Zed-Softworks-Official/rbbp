import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'

import type { CommandInteraction, AutocompleteInteraction } from 'discord.js'
import { api } from '@rbbp/backend/api'

import type { Command } from '~/utils/types'
import { tryCatch } from '~/utils/try-catch'

import { convex } from '~/lib/convex'
import { invalidate } from '~/lib/redis'

export const unregisterRole: Command = {
    data: new SlashCommandBuilder()
    .setName('unregister')
    .setDescription('Unregisters a role as "Protected"')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt =>
        opt.setName('role')
        .setDescription('Start typing the role name')
        .setAutocomplete(true)
        .setRequired(true
        ),
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

        await convex.mutation(api.roles.removeProtectedRole, {
            guildId,
            roleId,
        })

        await invalidate(guildId, role.id)

        await interaction.reply(`Role **${role.name}** unregistered as protected.`)
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        if (!interaction.isAutocomplete()) return

        const guildId = interaction.guildId
        if (!guildId) return

        const { error } = await tryCatch((async () => {
            const focused = interaction.options.getFocused() as string

            const protectedRoles = await convex.query(api.roles.getProtectedRoles, {
                guildId
            })

            const filtered = protectedRoles
                .filter(role => role.roleName.toLowerCase().startsWith(focused.toLowerCase()))
                .map(role => ({ name: role.roleName, value: role.roleId }))

            await interaction.respond(filtered)
        })())

        if (error) {
            console.error("Autocomplete error:", error)
        }

    }
}
