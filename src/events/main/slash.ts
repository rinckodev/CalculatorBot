import { CommandInteractionOptionResolver, InteractionType } from "discord.js";
import { client, Event, ExtendedInteraction } from "../../exports";

export default new Event('interactionCreate', (interaction) => {
    if (interaction.type == InteractionType.ApplicationCommand){

        const command = client.Commands.get(interaction.commandName);

        if (!command) return interaction.reply({ephemeral: true, content: 'Este comando ainda não foi configurado!'});
        command.run({
            client,
            interaction: interaction as ExtendedInteraction,
            options: interaction.options as CommandInteractionOptionResolver
        })
    }
})