module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "coins";
        this.aliases = ["atm", "moedas", "bal", "balance"];
    }

    async run({ args, message, prefix }) {
        try {
            if (!args[0]) {
                message.reply(`O uso correto do comando é **${prefix}coins (menção ou id)**.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let target = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
            if (!target) {
                message.reply(`O membro **${args[0]}** não foi encontrado.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let coins = 0;
            let targetUser = await this.client.database.users.findOne({ userId: target.id });
            if (targetUser) coins = targetUser.coins;
            message.reply(`O membro **${target.user.tag}** possui **${coins} moedas**.`);
        } catch (error) {
            console.log(error);
        }
    }
};