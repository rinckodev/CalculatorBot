import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, codeBlock, Colors, ComponentType, EmbedBuilder } from "discord.js";
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
        .setColor(Colors.Blue)
        .setFooter({text: `Usuário: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})

        const numberButtons: Array<ButtonBuilder> = new Array();

        for (let i = 0; i <= 9; i++) {
            numberButtons.push(
                new ButtonBuilder({
                    customId: `insert-number-button-${i}`,
                    label: `${i}`, style: ButtonStyle.Secondary
                })
            )
        }
        
        const closeButton = new ButtonBuilder({customId: "close-button", label: "X", style: ButtonStyle.Danger})
        const clearButton = new ButtonBuilder({customId: "clear-button", label: "C", style: ButtonStyle.Danger})
        const backspaceButton = new ButtonBuilder({customId: "backspace-button", label: "←", style: ButtonStyle.Danger})
        const historicButton = new ButtonBuilder({customId: "historic-button", emoji: "📝", style: ButtonStyle.Primary})

        const divisionButton = new ButtonBuilder({customId: "operator-button-division", label: " / ", style: ButtonStyle.Primary})
        const multiplyButton = new ButtonBuilder({customId: "operator-button-multiply", label: " * ", style: ButtonStyle.Primary})
        const subtractionButton = new ButtonBuilder({customId: "operator-button-subtraction", label: " - ", style: ButtonStyle.Primary})
        const additionButton = new ButtonBuilder({customId: "operator-button-addition", label: " + ", style: ButtonStyle.Primary})
        const resultButton = new ButtonBuilder({customId: "result-button", label: " = ", style: ButtonStyle.Success})

        const commaButton = new ButtonBuilder({customId: "comma-button", label: " , ", style: ButtonStyle.Secondary})
        const plusMinusButton = new ButtonBuilder({customId: "plusminus-button", label: "+/-", style: ButtonStyle.Secondary})

        const percentageButton = new ButtonBuilder({customId: "percentage-button", label: "%", style: ButtonStyle.Secondary})
        const powerButton = new ButtonBuilder({customId: "operator-button-power", label: "**", style: ButtonStyle.Secondary})
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
            numberButtons[4], numberButtons[5], numberButtons[6], subtractionButton
        ]})
        const row5 = new ActionRowBuilder<ButtonBuilder>({components: [
            numberButtons[1], numberButtons[2], numberButtons[3], additionButton
        ]})
        const row6 = new ActionRowBuilder<ButtonBuilder>({components: [
            plusMinusButton, numberButtons[0], commaButton, resultButton
        ]})

        interaction.reply({ephemeral: true, content: "Calculadora ativa!"})
        
        const msgTop = await interaction.channel?.send({embeds: [embed], components: [
            row1, row2
        ]})
        const msgBottom = await interaction.channel?.send({components: [
            row3, row4, row5, row6
        ]})
        
        if (!msgTop || !msgBottom) return;

        const filter = (i: ButtonInteraction) => {
            return i.message.id == msgTop.id || i.message.id == msgBottom.id;
        };

        const calculator = new Calculator()

        interaction.channel?.createMessageComponentCollector({componentType: ComponentType.Button, filter})
        .on("collect",async (buttonInteraction) => {
            
            if (buttonInteraction.user.id != interaction.user.id) {
                buttonInteraction.reply({ ephemeral: true, 
                    content: `Você não pode usar a calculadora de ${interaction.user.username}! \nUtilize o comando \`/calculadora\``
                })
                return;
            }
            
            const customID = buttonInteraction.customId;


            if (customID == "close-button") {
                msgTop.delete().catch(() => {})
                msgBottom.delete().catch(() => {})
                buttonInteraction.reply({ephemeral: true, content: "Calculadora fechada"})
                return
            }

            buttonInteraction.deferUpdate();

            const clearInput = () => {
                calculator.currOperation = "";
                calculator.status = CalculatorStatus.NEW_OPERATION;
            }

            const refreshInput = (text: string) => {
                embed.setDescription(codeBlock(text));
                msgTop.edit({embeds: [embed]})
            }

            const errorOperation = () => {
                clearInput();
                refreshInput("ERROR")
            }

            const backspace = () => {
                if (calculator.status == CalculatorStatus.IN_RESULT) return;
                const { currOperation } = calculator;

                if (calculator.currSlot == CalculatorSlot.OPEARTOR) {
                    calculator.currOperation = currOperation.substring(0, currOperation.length - 3);
                    calculator.currSlot = CalculatorSlot.NUMBER;
                } else {
                    calculator.currOperation = currOperation.substring(0, currOperation.length - 1);
                    const refreshOperation = calculator.currOperation;
                    const operator = calculator.checkOperators.get(refreshOperation.slice(refreshOperation.length - 3, refreshOperation.length))
                    if (operator) {
                        calculator.currSlot = CalculatorSlot.OPEARTOR
                    } else {
                        calculator.currSlot = CalculatorSlot.NUMBER;
                    }
                }
                
                if (calculator.currOperation.length < 1) {
                    refreshInput("...");
                    return;
                }
                refreshInput(calculator.currOperation);
                return;
            }

            if (customID.includes("insert-number-button-")) {
                if (calculator.status == CalculatorStatus.IN_RESULT) clearInput();

                const number = parseInt(customID.replace("insert-number-button-", ""))
                calculator.currOperation += `${number}`;
                calculator.currSlot = CalculatorSlot.NUMBER;
                refreshInput(calculator.currOperation);
                return;
            }

            if (customID.includes("operator-button-")) {
                if (calculator.status == CalculatorStatus.IN_RESULT){ 
                    clearInput()
                    calculator.currOperation = `${calculator.currResult}`;
                };
                const operator = calculator.operators.get(customID.replace("operator-button-", ""))!
                
                calculator.currOperation += ` ${operator} `;
                calculator.currSlot = CalculatorSlot.OPEARTOR;
                refreshInput(calculator.currOperation);
                return;
            }

            if (customID == "clear-button"){
                clearInput()
                refreshInput("...");
                return;
            }

            if (customID == "backspace-button"){
                backspace()
            }

            if (customID == "historic-button"){
                const text = "Histórico: \n" + "> " + calculator.historic.join("\n> ")
                refreshInput(text)
                return;
            }

            if (customID == "result-button") {
                if (calculator.status == CalculatorStatus.IN_RESULT) {
                    clearInput()
                    refreshInput("...");
                    return;
                }
                let result: number;
                try {
                    result = eval(calculator.currOperation);
                } catch (error) {
                    errorOperation();
                    return;
                }
                calculator.historic.push(`${calculator.currOperation} = ${result}`);
                calculator.currOperation = `Resultado de: ${calculator.currOperation} \n${result}`;
                calculator.status = CalculatorStatus.IN_RESULT;
                calculator.currResult = result;
                calculator.currSlot = CalculatorSlot.EMPTY;
                refreshInput(calculator.currOperation);
            }
        })
        // ....
    },
})

enum CalculatorStatus {
    IN_RESULT,
    NEW_OPERATION,
}
enum CalculatorSlot {
    OPEARTOR,
    NUMBER,
    EMPTY

}
class Calculator {
    status: CalculatorStatus = CalculatorStatus.NEW_OPERATION; 
    currOperation: string = "";
    currResult: number = 0;
    currSlot: CalculatorSlot = CalculatorSlot.EMPTY;
    historic: Array<string> = new Array();
    operators: Map<string, string> = new Map([
        ["power","**"],
        ["addition","+"],
        ["subtraction","-"],
        ["multiply","*"],
        ["division","/"]
    ])
    checkOperators: Map<string, string> = new Map([
        [" ** ","**"],
        [" + ","+"],
        [" - ","-"],
        [" * ","*"],
        [" / ","/"]
    ])
}