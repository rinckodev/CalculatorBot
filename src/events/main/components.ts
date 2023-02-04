import { ComponentType, InteractionType } from "discord.js";
import { client, Event } from "../../exports";

export default new Event('interactionCreate', (interaction) => {
	if (interaction.type != InteractionType.ModalSubmit && interaction.type != InteractionType.MessageComponent) return;
	const customID = interaction.customId;

	switch(interaction.type){
		case InteractionType.ModalSubmit: {
			client.Modals.get(customID)?.(interaction)
		}
		case InteractionType.MessageComponent: {
			if (interaction.isButton()) client.Buttons.get(customID)?.(interaction);
			if (interaction.isAnySelectMenu()) client.SelectMenus.get(customID)?.(interaction);
		}
	}
})