import { AnySelectMenuInteraction, ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, ContextMenuCommandInteraction, GuildMember, MessageContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, UserContextMenuCommandInteraction } from "discord.js";
import ExtendedClient from "./ExtendedClient";

interface RunOptions {
    client: ExtendedClient
    interaction: CommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction
    options: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = ApplicationCommandData & {
    run: RunFunction
    buttons?: Collection<string, (interaction: ButtonInteraction) => any>;
    selectMenus?: Collection<string, (interaction: AnySelectMenuInteraction) => any>;
    modals?: Collection<string, (interaction: ModalSubmitInteraction) => any>;
}

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

export class Command {
    constructor(commandOptions: CommandType){
        Object.assign(this, commandOptions)
    }
}