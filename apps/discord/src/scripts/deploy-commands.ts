import { deployCommands } from '~/utils/deploy-commands'
import { env } from '~/env'

deployCommands(env.DISCORD_GUILD_ID)
    .then(() => {
        console.log('Successfully Deployed Commands')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Error Deploying Commands:', error)
        process.exit(1)
    })
