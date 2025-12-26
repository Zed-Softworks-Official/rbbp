import { v } from "convex/values"
import { mutation } from "@rbbp/backend/server"

export const logBan = mutation({
    args: {
        userId: v.string(),
        username: v.string(),
        globalName: v.string(),
        tag: v.string(),
        discriminator: v.string(),
        bot: v.boolean(),
        accountCreated: v.number(),
        joinedServer: v.number(),
        avatar: v.string(),
        roles: v.array(v.string()),
        nickname: v.optional(v.string()),
        banTimestamp: v.number(),
        reason: v.string(),
        protectedRoleId: v.string(),
        guildId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('bans', args)
    }
})

