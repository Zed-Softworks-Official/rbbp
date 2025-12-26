import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
    server: {
        DISCORD_TOKEN: z.string()
    },
    runtimeEnv: process.env,
    emptyStringIsUndefined: true
})
