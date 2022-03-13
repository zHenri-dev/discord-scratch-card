module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "daily";
        this.aliases = [];
    }

    async run({ args, message, prefix }) {
        try {
            let user = await this.client.database.users.findOne({ userId: message.author.id });
            if (!user) {
                user = await this.client.database.users.create({
                    userId: message.author.id,
                    coins: 0,
                    cooldown: 0,
                    profit: 0,
                    bought: 0
                })
            }
            if (user.cooldown > new Date().getTime()) {
                let time = await this.client.functions.getFormatedTime(user.cooldown);
                message.reply(`Você deve aguardar mais **${time}** para coletar novamente para pegar suas moedas diárias.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let random = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
            user.coins = user.coins + random;
            user.cooldown = new Date().getTime() + 60 * 60 * 24 * 1000; // 24 hours;
            user.save();
            message.reply(`Parabéns! Você recebeu **${random}** moedas em seu prêmio diário. Você deve aguardar **24 horas** para pega-lo novamente.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 30000); })
        } catch (error) {
            console.log(error);
        }
    }
};