const colors = require("colors")

module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "ready";
    }

    async run() {
        this.client.user.setActivity(`Sistema de raspadinha desenvolvido por zHenri_`);
        console.log(colors.green(`[${this.client.user.username}] O bot foi inicializado com sucesso!`));
    }
};