import { ApplicationCommandType } from "discord.js";
import { Command } from "../../exports";

export default new Command({
    name: "calculadora",
    description: "Uma calculadora para operações matemáticas simples",
    run({client, interaction, options}) {
        if (interaction.commandType != ApplicationCommandType.ChatInput) return;
        const guild = interaction.guild;

        if (!guild) {
            interaction.reply({ephemeral: true, content: "Este comando só pode ser utilizado em uma guilda!"})
            return;
        }
        // ....
    },
})