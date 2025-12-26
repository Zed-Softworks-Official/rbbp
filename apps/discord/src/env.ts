import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
    server: {
        DISCORD_CLIENT_ID: z.string(),
        DISCORD_TOKEN: z.string(),
        DISCORD_GUILD_ID: z.string().optional()
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true
})
