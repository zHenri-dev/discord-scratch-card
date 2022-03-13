const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const colors = require("colors");
const config = require("./config/config.json");
const customEmojis = require("./config/emojis.json");
const Functions = require("./objects/functions.js");
const Database = require("./database/index.js");
const User = require("./database/schemas/user.js"),
    Already = require("./database/schemas/already.js")

class Bot extends Client {
    constructor(options) {
        super(options)
        this.commands = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.customEmojis = customEmojis;
        this.functions = new Functions(this);
        this.database = [];
        this.database.users = User;
        this.database.already = Already;
    }

    login() {
        return super.login(config.token);
    }

    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${commandName}`))(this);
            props.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.name, props);
            props.aliases.forEach(aliase => {
                this.aliases.set(aliase, props.name);
            });
        } catch (error) {
            console.error(error);
            console.log(colors.red(`[Commands] Ocorreu um erro ao inicializar o comando ${commandName}`));
        }
    }
}

const client = new Bot({
    intents: 32767,
    partials: ["CHANNEL"]
})

Database.connect();

async function loadCommands() {
    const commands = readdirSync(`./src/commands/`).filter(file => file.endsWith('.js'));
    commands.forEach(async commandFile => {
        client.loadCommand(`./commands/`, `${commandFile}`);
    });
    if (client.commands.size > 0) { (client.commands.size !== 1) ? console.log(colors.green(`[Commands] Foram inicializados ${client.commands.size} comandos com sucesso!`)) : console.log(colors.green(`[Commands] Foi inicializado ${client.commands.size} comando com sucesso!`)) }
}

async function loadEvents() {
    let x = 0;
    const events = readdirSync(`./src/events/`).filter(file => file.endsWith('.js'));
    events.forEach(async eventFile => {
        const eventName = eventFile.substring(0, eventFile.length - 3);
        try {
            const event = new (require(`./events/${eventFile}`))(client);
            client.on(event.eventName, (...args) => event.run(...args));
            x++;
        } catch (error) {
            console.error(error);
            console.log(colors.red(`[Events] Ocorreu um erro ao inicializar o evento ${eventName}.`));
        }
    });
    if (x > 0) { (x !== 1) ? console.log(colors.green(`[Events] Foram inicializados ${x} eventos com sucesso!`)) : console.log(colors.green(`[Commands] Foi inicializado ${x} evento com sucesso!`)) }
}

loadCommands();
loadEvents();
client.login();