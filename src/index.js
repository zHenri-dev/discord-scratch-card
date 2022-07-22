const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const { connectDatabase } = require("./database/index.js");
const Functions = require("./objects/functions.js");

const config = require("./config/config.json"),
    customEmojis = require("./config/emojis.json")

const User = require("./database/schemas/user.js"),
    Already = require("./database/schemas/already.js")

class ScratchCardClient extends Client {
    constructor(options) {
        super(options)
        this.commands = new Collection();
        this.aliases = new Collection();
        this.startedAt = performance.now();
        this.config = config;
        this.customEmojis = customEmojis;
        this.functions = new Functions(this);
        this.database = [];
        this.database.users = User;
        this.database.already = Already;
    }

    start() {
        this.login(this.config.token);
        connectDatabase();
        this.loadCommands();
        this.loadEvents();
    }

    loadCommands() {
        let startedAt = performance.now();
        let commandsCount = 0;
        const commands = readdirSync("./src/commands/").filter(file => file.endsWith(".js"));
        commands.forEach(command => {
            try {
                const props = new (require(`./commands/${command}`))(this);
                props.location = `./commands/`;
                if (props.init) {
                    props.init(this);
                }
                this.commands.set(props.name, props);
                props.aliases.forEach(aliase => {
                    this.aliases.set(aliase, props.name);
                });
                commandsCount++;
            } catch (error) {
                console.log(error);
                console.log(`\x1b[91m[Commands] Ocorreu um erro ao carregar o comando ${command} \x1b[0m`);
            }
        })
        let finishedAt = performance.now();
        let time = (finishedAt - startedAt).toFixed(2).replace(".00", "");
        console.log(`\x1b[32m[Commands] Foram carregados ${commandsCount} comandos em ${time}ms\x1b[0m`);
    }

    loadEvents() {
        let startedAt = performance.now();
        let eventsCount = 0;
        const events = readdirSync(`./src/events/`).filter(file => file.endsWith('.js'));
        events.forEach(async eventFile => {
            try {
                const event = new (require(`./events/${eventFile}`))(this);
                this.on(event.eventName, (...args) => event.run(...args));
                eventsCount++;
            } catch (error) {
                console.error(error);
                console.log(`\x1b[91m[Events] Ocorreu um erro ao carregar o evento ${eventFile} \x1b[0m`);
            }
        });
        let finishedAt = performance.now();
        let time = (finishedAt - startedAt).toFixed(2).replace(".00", "");
        console.log(`\x1b[32m[Events] Foram carregados ${eventsCount} eventos em ${time}ms\x1b[0m`);
    }
}

const ScratchCard = new ScratchCardClient({
    intents: [
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

ScratchCard.start();