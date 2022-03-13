module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "Nome";
        this.aliases = [];
    }

    async run({ args, message, prefix }) {
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
};