import { v } from "convex/values";
import { mutation, query } from '@rbbp/backend/server'

export const getLogChannel = query({
    args: {
        guildId: v.string(),
    },
    handler: async (ctx, args) => {
        const logChannel = await ctx.db.query('logChannels')
            .withIndex('byGuildId', (q) => q.eq('guildId', args.guildId))
            .first()

        if (!logChannel) return null

        return logChannel.channelId
    }
})

export const setLogChannel = mutation({
    args: {
        guildId: v.string(),
        channelId: v.string(),
    },
    handler: async (ctx, args) => {
        const logChannel = await ctx.db.query('logChannels')
            .withIndex('byGuildId', (q) => q.eq('guildId', args.guildId))
            .first()

        if (logChannel) {
            await ctx.db.patch(logChannel._id, {
                channelId: args.channelId
            })

            return
        }

        await ctx.db.insert('logChannels', {
            guildId: args.guildId,
            channelId: args.channelId,
        })
    }
})
