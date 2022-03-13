const { MessageEmbed } = require("discord.js");

module.exports = class Command {
    constructor(client) {
        this.client = client;

        this.name = "scratch";
        this.aliases = ["raspadinha"];
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
            if (!args[0]) {
                message.channel.send({ content: `:star2: **|** ${message.author} **Rapadinha do zHenri**\n:star_struck: **|** Ganhe prêmios comprando um ticket para raspar!\n🎫 **|** Ao comprar, raspe clicando nos spoilers e veja os emojis que aparecem!\n👥 **|** Se tiver alguma combinação na horizontal, vertical ou na diagional, você pode ganhar prêmios!\n🔹 **| Combinação de <:thumbsup_henri:${this.client.customEmojis.thumbsup_henri}>:** 100000 moedas\n🔹 **| Combinação de <:middle_finger_henri:${this.client.customEmojis.middle_finger_henri}>:** 10000 moedas\n🔹 **| Combinação de <:henribaleia:${this.client.customEmojis.henribaleia}>:** 1000 moedas\n🔹 **| Combinação de <:henricara:${this.client.customEmojis.henricara}>:** 375 moedas\n🔹 **| Combinação de <:beluga:${this.client.customEmojis.beluga}>:** 250 moedas\n🔹 **| Combinação de <:que:${this.client.customEmojis.que}>:** 100 moedas\n🔹 | Você já comprou **${user.bought} raspadinhas** e, com elas, você ganhou **${user.profit} moedas**\n💵 | Compre uma raspadinha do zHenri por **150 moedas** usando \`+raspadinha comprar\`!` })
                return;
            }
            if (args[0].toLowerCase() == "comprar") {
                if (user.coins >= 150) {
                    let content = await this.client.functions.buyScratchCard(message.author);
                    let scratchCard = await message.channel.send({ content });
                    scratchCard.react("💵"); scratchCard.react("🔄");
                    user.coins = user.coins - 150;
                    user.bought++;
                    user.save();
                } else {
                    message.reply(`Você não possui moedas suficientes. **(150)**`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); if (message.guild) { message.delete().catch(() => { }); } }, 15000); })
                }
                return;
            } else {
                message.channel.send({ content: `:star2: **|** ${message.author} **Rapadinha do zHenri**\n:star_struck: **|** Ganhe prêmios comprando um ticket para raspar!\n🎫 **|** Ao comprar, raspe clicando nos spoilers e veja os emojis que aparecem!\n👥 **|** Se tiver alguma combinação na horizontal, vertical ou na diagional, você pode ganhar prêmios!\n🔹 **| Combinação de <:thumbsup_henri:${this.client.customEmojis.thumbsup_henri}>:** 100000 moedas\n🔹 **| Combinação de <:middle_finger_henri:${this.client.customEmojis.middle_finger_henri}>:** 10000 moedas\n🔹 **| Combinação de <:henribaleia:${this.client.customEmojis.henribaleia}>:** 1000 moedas\n🔹 **| Combinação de <:henricara:${this.client.customEmojis.henricara}>:** 375 moedas\n🔹 **| Combinação de <:beluga:${this.client.customEmojis.beluga}>:** 250 moedas\n🔹 **| Combinação de <:que:${this.client.customEmojis.que}>:** 100 moedas\n🔹 | Você já comprou **${user.bought} raspadinhas** e, com elas, você ganhou **${user.profit} moedas**\n💵 | Compre uma raspadinha do zHenri por **150 moedas** usando \`+raspadinha comprar\`!` })
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};