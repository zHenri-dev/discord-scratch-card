module.exports = class Command {
    constructor(client) {
        this.client = client;
        this.name = "setcoins";
        this.aliases = ["setmoedas", "setarmoedas"];
    }

    async run({ args, message, prefix }) {
        try {
            if (!message.guild) return;
            if (message.member && !message.member.permissions.has("ADMINISTRATOR")) {
                message.reply(`Você não possui permissão para executar este comando.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            if (!args[0] || !args[1] || !args[2]) {
                message.reply(`O uso correto do comando é **${prefix}setcoins (add/remove) (menção ou id) (quantia)**.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let target = await message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
            if (!target) {
                message.reply(`O membro **${args[1]}** não foi encontrado.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let targetUser = await this.client.database.users.findOne({ userId: target.id });
            if (!targetUser) {
                targetUser = await this.client.database.users.create({
                    userId: target.id,
                    coins: 0,
                    cooldown: 0,
                    profit: 0,
                    bought: 0
                });
            }
            let amount = parseInt(args[2]);
            if (!amount) {
                message.reply(`A quantia **${args[2]}** é inválida.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            switch (args[0]) {
                case "add":
                    targetUser.coins = targetUser.coins + amount;
                    targetUser.save();
                    message.reply(`Foram adicionada(s) **${amount} moedas** na conta do membro **${target.user.tag}** com sucesso!`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 30000); })
                    break;
                case "remove":
                    if (targetUser.coins < amount) {
                        message.reply(`O membro **${target.user.tag}** não possui moedas suficientes. **(${amount})**`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                        return;
                    }
                    targetUser.coins = targetUser.coins - amount;
                    targetUser.save();
                    message.reply(`Foram removida(s) **${amount} moedas** da conta do membro **${target.user.tag}** com sucesso!`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 30000); })
                    break;
                default:
                    message.reply(`O uso correto do comando é **${prefix}setcoins (add/remove) (menção ou id)**.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
};