import { v } from 'convex/values'
import { mutation, query } from '@rbbp/backend/server'

export const addProtectedRole = mutation({
    args: {
        guildId: v.string(),
        roleId: v.string(),
        roleName: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('protectedRoles', {
            ...args
        })
    }
})

export const removeProtectedRole = mutation({
    args: {
        guildId: v.string(),
        roleId: v.string()
    },
    handler: async (ctx, args) => {
        const role = await ctx.db.query('protectedRoles')
            .withIndex('byGuildId', (q) => q.eq('guildId', args.guildId))
            .filter((q) => q.eq(q.field('roleId'), args.roleId))
            .first()

        if (!role) return

        await ctx.db.delete('protectedRoles', role._id)
    }
})

export const getProtectedRoles = query({
    args: {
        guildId: v.string(),
    },
    handler: async (ctx, args) => {
        const roles = await ctx.db.query('protectedRoles')
            .withIndex('byGuildId', (q) => q.eq('guildId', args.guildId))
            .collect()

        return roles
    }
})
