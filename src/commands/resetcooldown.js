module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "resetcooldown";
        this.aliases = [];
    }

    async run({ args, message, prefix }) {
        try {
            if (!message.guild) return;
            if (message.member && !message.member.permissions.has("ADMINISTRATOR")) {
                message.reply(`Você não possui permissão para executar este comando.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            if (!args[0]) {
                message.reply(`O uso correto do comando é **${prefix}resetcooldown (menção ou id)**.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let target = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
            if (!target) {
                message.reply(`O membro **${args[0]}** não foi encontrado.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            let targetUser = await this.client.database.users.findOne({ userId: target.id });
            if (!targetUser) {
                message.reply(`O membro **${target.user.tag}** não coletou nenhum prêmio diário.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                return;
            }
            targetUser.cooldown = 0;
            targetUser.save();
            message.reply(`O membro **${target.user.tag}** teve seu cooldown resetado.`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 30000); })
        } catch (error) {
            console.log(error);
        }
    }
};