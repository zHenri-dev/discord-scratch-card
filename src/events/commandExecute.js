module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "messageCreate";
    }

    async run(message) {
        try {
            if (message.author.bot === true) return;

            let prefix = this.client.config.prefix;;
            if (message.mentions.has(this.client.user) || message.content.startsWith(prefix)) {
                let args;
                let commandName;
                let command;

                if (message.mentions.has(this.client.user)) {
                    args = message.content.slice(`<@!905200917534629949>`.length).trim().split(/ +/g);
                    commandName = args.shift().toLowerCase();
                } else if (message.content.startsWith(prefix)) {
                    args = message.content.slice(prefix.length).trim().split(/ +/g);
                    commandName = args.shift().toLowerCase();
                }

                if (commandName.length == 0 && message.mentions.has(this.client.user)) return message.reply(`Olá! Meu prefixo aqui é **${prefix}**.`);
                else if (commandName.length == 0) return

                command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName))
                if (command) try {  command.run({ args, message, prefix }); } catch (error) { console.log(error); console.log(colors.red(`[Commands] Ocorreu um erro ao executar o comando ${commandName}.`)) }
            }
        } catch (error) {
            if (error) console.error(error);
        }
    }
};