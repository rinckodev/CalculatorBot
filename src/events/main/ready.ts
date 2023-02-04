import { Event } from "../../exports";

export default new Event("ready", (client) => {
    console.log(`🟩 ${client.user.username} iniciado com sucesso!`);
})