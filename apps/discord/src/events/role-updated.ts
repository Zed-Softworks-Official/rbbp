import { Events, GuildMember, EmbedBuilder, Colors, TextChannel } from 'discord.js'
import { api } from '@rbbp/backend/api'

import { loadProtectedRoles, isProtectedRole } from '~/lib/redis'
import { convex } from '~/lib/convex'

import type { ExtendedClient } from '~/utils/types'
import { tryCatch } from '~/utils/try-catch'

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

            await handleProtectedRoleAdded(newMember, role.id, guildId)
        }
    })
}

async function handleProtectedRoleAdded(
    member: GuildMember,
    roleId: string,
    guildId: string
) {
    const logChannelId = await convex.query(api.log.getLogChannel, {
        guildId,
    })

    const { error } = await tryCatch((async () => {
        const userData = captureUserData(
            member,
            roleId,
            `Added role ${roleId} to ${member.user.username}#${member.user.discriminator}`
        )

        await convex.mutation(api.ban.logBan, userData)

        // TODO: Ban User

        if (!logChannelId) return
        const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel
        const role = member.guild.roles.cache.get(roleId)

        const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`Potential Bot Prottection Violation`)
        .setThumbnail(userData.avatar)
        .addFields(
            { name: 'User', value: `${userData.tag}\n<@${userData.userId}>`, inline: true },
            { name: 'Username', value: userData.username, inline: true },
            { name: 'Nickname', value: userData.nickname ?? 'None', inline: true },
            { name: 'Role', value: `${role?.name}\n<@&${roleId}>`, inline: true },
            { name: 'Account Created', value: `<t:${Math.floor(userData.accountCreated / 1000)}:R>`, inline: true },
            { name: 'Joined Server', value: `<t:${Math.floor(userData.joinedServer / 1000)}:R>`, inline: true },
            { name: 'Bot', value: userData.bot ? 'Yes' : 'No', inline: true },
            { name: 'Roles', value: userData.roles.length > 0
                ? userData.roles.slice(0, 10).map(id => `<@&${id}>`).join(', ')
                : 'None', inline: false },
        )
        .setFooter({ text: `User ID: ${userData.userId}` })
        .setTimestamp()

        await logChannel.send({ embeds: [embed] })
    })())

    if (error) {
        console.error(error)
    }
}

function captureUserData(member: GuildMember, roleId: string, reason: string) {
    return {
        userId: member.id,
        username: member.user.username,
        globalName: member.user.globalName ?? member.user.username,
        tag: member.user.tag,
        discriminator: member.user.discriminator,
        bot: member.user.bot,
        accountCreated: member.user.createdTimestamp,
        joinedServer: member.joinedTimestamp!,
        avatar: member.user.displayAvatarURL({ size: 256 }),
        roles: member.roles.cache.map(r => r.id),
        nickname: member.nickname ?? undefined,
        banTimestamp: Date.now(),
        reason,
        protectedRoleId: roleId,
        guildId: member.guild.id,
    }
}
