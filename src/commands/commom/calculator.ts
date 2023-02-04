import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, codeBlock, Colors, ComponentType, EmbedBuilder } from "discord.js";
import { Command } from "../../exports";

export default new Command({
    name: "calculadora",
    description: "Uma calculadora para operações matemáticas simples",
    async run({client, interaction, options}) {
        if (interaction.commandType != ApplicationCommandType.ChatInput) return;
        const guild = interaction.guild;

        if (!guild) {
            interaction.reply({ephemeral: true,content:"Este comando só pode ser utilizado em uma guilda!"})
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle("🧮 Calculadora")
        .setDescription(codeBlock("..."))
        .setColor(Colors.Blue);

        const baseButtonSuccess = new ButtonBuilder({style: ButtonStyle.Success})
        const baseButtonPrimary = new ButtonBuilder({style: ButtonStyle.Primary})
        const baseButtonSecondary = new ButtonBuilder({style: ButtonStyle.Secondary})
        const baseButtonDanger = new ButtonBuilder({style: ButtonStyle.Danger})

        const numberButtons: Array<ButtonBuilder> = new Array();

        for (let i = 0; i <= 9; i++) {
            numberButtons.push(
                new ButtonBuilder({
                    customId: `insert-button-number-${i}`,
                    label: `${i}`, style: ButtonStyle.Secondary
                })
            )
        }
        const emptyButton = new ButtonBuilder({customId: "empty-button", label: " ", style: ButtonStyle.Secondary})

        const divisionButton = new ButtonBuilder({customId: "division-button", label: " / ", style: ButtonStyle.Primary})
        const multiplyButton = new ButtonBuilder({customId: "multipy-button", label: " * ", style: ButtonStyle.Primary})
        const subtractButton = new ButtonBuilder({customId: "subtract-button", label: " - ", style: ButtonStyle.Primary})
        const addButton = new ButtonBuilder({customId: "add-button", label: " + ", style: ButtonStyle.Primary})
        const resultButton = new ButtonBuilder({customId: "result-button", label: " = ", style: ButtonStyle.Success})

        const commaButton = new ButtonBuilder({customId: "comma-button", label: " , ", style: ButtonStyle.Secondary})
        const plusMinusButton = new ButtonBuilder({customId: "plusminus-button", label: "+/-", style: ButtonStyle.Secondary})

        const closeButton = new ButtonBuilder({customId: "close-button", label: "X", style: ButtonStyle.Danger})
        const clearButton = new ButtonBuilder({customId: "clear-button", label: "C", style: ButtonStyle.Danger})
        const backspaceButton = new ButtonBuilder({customId: "backspace-button", label: "←", style: ButtonStyle.Danger})
        const historicButton = new ButtonBuilder({customId: "historic-button", emoji: "📝", style: ButtonStyle.Primary})

        const percentageButton = new ButtonBuilder({customId: "percentage-button", label: "%", style: ButtonStyle.Secondary})
        const powerButton = new ButtonBuilder({customId: "power-button", label: "**", style: ButtonStyle.Secondary})
        const squareRootButton = new ButtonBuilder({customId: "squareroot-button", label: "√", style: ButtonStyle.Secondary})

        const row1 = new ActionRowBuilder<ButtonBuilder>({components: [
           closeButton, clearButton, backspaceButton, historicButton,
        ]})
        const row2 = new ActionRowBuilder<ButtonBuilder>({components: [
            percentageButton, powerButton, squareRootButton, divisionButton
        ]})
        const row3 = new ActionRowBuilder<ButtonBuilder>({components: [
            numberButtons[7] ,numberButtons[8],numberButtons[9], multiplyButton
        ]})
        const row4 = new ActionRowBuilder<ButtonBuilder>({components: [ 
            numberButtons[4], numberButtons[5], numberButtons[6], subtractButton
        ]})
        const row5 = new ActionRowBuilder<ButtonBuilder>({components: [
            numberButtons[1], numberButtons[2], numberButtons[3], addButton
        ]})
        const row6 = new ActionRowBuilder<ButtonBuilder>({components: [
            plusMinusButton, numberButtons[0], commaButton, resultButton
        ]})

        interaction.reply({ephemeral: true, content: "Calculadora ativa!"})
        
        await interaction.channel?.send({embeds: [embed], components: [
            row1, row2
        ]})
        await interaction.channel?.send({components: [
            row3, row4, row5, row6
        ]})

        // ....
    },
})