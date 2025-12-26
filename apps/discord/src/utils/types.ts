import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    CommandInteraction,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    Client,
    Collection,
} from 'discord.js'

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: CommandInteraction | ChatInputCommandInteraction) => Promise<void>
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>
}

