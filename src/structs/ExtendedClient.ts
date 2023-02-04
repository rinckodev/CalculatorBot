import { Client, Partials, Collection, ApplicationCommandDataResolvable, ClientEvents, ButtonInteraction, 
     ModalSubmitInteraction, AnySelectMenuInteraction, GatewayIntentBits, IntentsBitField } from "discord.js";
import { CommandType } from "./Command";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Event } from "./Events";
dotenv.config();

export default class ExtendedClient extends Client {
    public Commands: Collection<String, CommandType> = new Collection();
    public Buttons: Collection<String, (interaction: ButtonInteraction) => any> = new Collection();
    public SelectMenus: Collection<String, (interaction: AnySelectMenuInteraction) => any> = new Collection();
    public Modals: Collection<String, (interaction: ModalSubmitInteraction) => any> = new Collection();

    constructor(){
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,

            ],
            partials: [
                Partials.Channel, Partials.GuildMember,
                Partials.GuildScheduledEvent, Partials.Message,
                Partials.User
            ] 
        })
    }

    public start(){
        this.registerModules();
        this.login(process.env.BOTTOKEN)
    }
    public async registerCommands(commands: ApplicationCommandDataResolvable[]){

        this.application?.commands.set(commands)
        .then(() => console.log(`✅ Comandos Slash (/) definidos`))
        .catch((err) => console.log(`❌ Ocorreu um erro ao tentar definir os Comandos Slash (/)\n` + err))
    }

    private registerModules(){

        // Commands
        const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

        const commandPath = path.join(__dirname, "..", "commands")
        const fileCondition = (fileName: string) => fileName.endsWith(".js") || fileName.endsWith(".ts");
        fs.readdirSync(commandPath).forEach(local => {

            fs.readdirSync(commandPath + `/${local}/`).filter(fileCondition).forEach(async fileName => {
                const command: CommandType = (await import(`../commands/${local}/${fileName}`))?.default

                if (!command?.name) return;
                this.Commands.set(command.name, command);
                slashCommands.push(command)

                // Buttons / Selects / Modals
                if (command.buttons) this.Buttons = new Collection([...this.Buttons, ...command.buttons])
                if (command.selectMenus) this.SelectMenus = new Collection([...this.SelectMenus, ...command.selectMenus])
                if (command.modals) this.Modals = new Collection([...this.Modals, ...command.modals])

            })
        })

        this.on('ready', () => this.registerCommands(slashCommands))

        // Events
        const eventPath = path.join(__dirname, '..', 'events');
        fs.readdirSync(eventPath).forEach(local => {
            
            fs.readdirSync(`${eventPath}/${local}/`)
            .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
            .forEach(async (filename) => {
                const {event, run}: Event<keyof ClientEvents> = (await import(`../events/${local}/${filename}`))?.default
                try {
                    this.on(event, run)
                } catch (error) {
                    console.error(`Ocorreu um erro no evento ${event}\n`,error)
                }

            });
        })
    }
}