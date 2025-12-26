import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
    server: {
        DISCORD_CLIENT_ID: z.string(),
        DISCORD_TOKEN: z.string(),
        DISCORD_GUILD_ID: z.string().optional(),

        CONVEX_URL: z.url(),

        UPSTASH_REDIS_REST_URL: z.string(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true
})
