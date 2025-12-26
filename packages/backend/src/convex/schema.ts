import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    bans: defineTable({
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
    })
    .index("byUserId", ["userId"])
    .index("byGuildId", ["guildId"])
    .index("byTime", ["banTimestamp"]),
    protectedRoles: defineTable({
        guildId: v.string(),
        roleId: v.number(),
        roleName: v.string()
    })
    .index("byGuildId", ["guildId"]),
});
