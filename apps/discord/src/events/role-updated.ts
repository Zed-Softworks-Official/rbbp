import { Events, GuildMember } from 'discord.js'
import type { ExtendedClient } from '~/utils/types'

import { loadProtectedRoles, isProtectedRole } from '~/lib/redis'

export function registerRoleUpdatedEvent(client: ExtendedClient) {
    client.on(Events.GuildAvailable, async (guild) => {
        await loadProtectedRoles(guild.id)
        console.log(`Loaded protected roles for ${guild.name} (${guild.id})`)
    })

    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        // Quick bail if the role wasn't updated
        if (oldMember.roles.cache.size === newMember.roles.cache.size) {
            console.log('No role changes')
            return
        }
        const guildId = newMember.guild.id

        const addedRoles = newMember.roles.cache.filter(
            role => !oldMember.roles.cache.has(role.id)
        )

        for (const [, role] of addedRoles) {
            const isProtected = await isProtectedRole(guildId, role.id)
            if (!isProtected) continue

            await handleProtectedRoleAdded(newMember, role.id)
        }
    })
}

async function handleProtectedRoleAdded(member: GuildMember, roleId: string) {
    console.log(JSON.stringify(member, null, 2))
}
