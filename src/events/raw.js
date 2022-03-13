module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "raw";
    }

    async run(data) {
        if (data.t == "MESSAGE_REACTION_ADD" || data.t == "MESSAGE_REACTION_REMOVE") {
            if (data.d.emoji.name == "🔄" || data.d.emoji.name == "💵") {
                let user = await this.client.users.cache.get(data.d.user_id);
                if (!user || user.bot) return;
                let guild = await this.client.guilds.cache.get(data.d.guild_id);
                if (!guild) return;
                let channel = await guild.channels.cache.get(data.d.channel_id);
                if (!channel) return;
                let message = await channel.messages.fetch(data.d.message_id).catch(() => { });
                if (!message) return;
                if (message.author.id != this.client.user.id) return;
                if (!message.content.startsWith(`<@${user.id}> **aqui está sua raspadinha!**`)) return;
                let userSchema = await this.client.database.users.findOne({ userId: user.id });
                if (!userSchema) return;

                switch (data.d.emoji.name) {
                    case "🔄":
                        if (userSchema.coins < 150) {
                            channel.send(`${user} você não possui moedas suficientes para comprar outra raspadinha. **(150)**`)
                            return;
                        }
                        let noContent = `${user} **aqui está sua raspadinha!**\n\nRaspe clicando na parte cinza e, se o seu cartão for premiado com combinações de emojis na horizontal/vertical/diagonal, clique em 💵 para receber a sua recompensa! Mas cuidado, não tente resgatar prêmios de uma raspadinha que não tem prêmios!!\nSe você quiser comprar um novo ticket pagando **150 moedas**, aperte em 🔄!\n\n** **`;
                        message.edit({ content: noContent });
                        let newContent = await this.client.functions.buyScratchCard(user);
                        message.edit({ content: newContent });
                        userSchema.coins = userSchema.coins - 150;
                        userSchema.bought++;
                        userSchema.save();
                        break;
                    case "💵":
                        let checkAlready = await this.client.database.already.findOne({messageId: message.id});
                        if (checkAlready) {
                            channel.send(`${user} Você já recebeu o prêmio desta raspadinha!`)
                            return;
                        }
                        let has = false;
                        let lines = message.content.split("\n");
                        let line1 = lines[5].replace("||||", "||").split("||").filter(item => item != "");
                        let line2 = lines[6].replace("||||", "||").split("||").filter(item => item != "");
                        let line3 = lines[7].replace("||||", "||").split("||").filter(item => item != "");
                        if (line1[0] == line1[1] && line1[0] == line1[2]) has = await check(this.client, line1[0]);
                        if (line2[0] == line2[1] && line2[0] == line2[2]) has = await check(this.client, line2[0]);
                        if (line3[0] == line3[1] && line3[0] == line3[2]) has = await check(this.client, line3[0]);
                        if (line1[0] == line2[0] && line1[0] == line3[0]) has = await check(this.client, line1[0]);
                        if (line1[1] == line2[1] && line1[1] == line3[1]) has = await check(this.client, line1[1]);
                        if (line1[2] == line2[2] && line1[2] == line3[2]) has = await check(this.client, line1[2]);
                        if (line1[0] == line2[1] && line1[0] == line3[2]) has = await check(this.client, line1[0]);
                        if (line1[2] == line2[1] && line1[2] == line3[0]) has = await check(this.client, line1[2]);
                        
                        async function check(client, type) {
                            let amount = await client.functions.getAmount(type);
                            userSchema.coins = userSchema.coins + amount;
                            userSchema.profit = userSchema.profit + amount;
                            userSchema.save();
                            channel.send(`${user} Parabéns, você ganhou **${amount} moedas** na sua raspadinha!`)
                            client.database.already.create({
                                messageId: message.id,
                            })
                            return true;
                        }

                        if (!has) {
                            if (userSchema.coins >= 1000) {
                                userSchema.coins = userSchema.coins - 1000;
                                userSchema.save();
                                channel.send(`${user} Qual parte de *não resgate um prêmio se você não ganhou* você não entendeu? Só por fazer perder o meu tempo, você perdeu 1000 moedas.`);
                            } else {
                                channel.send(`${user} Qual parte de *não resgate um prêmio se você não ganhou* você não entendeu? Só por fazer perder o meu tempo, você perdeu ${userSchema.coins} moedas.`);
                                userSchema.coins = 0;
                                userSchema.save();                            
                            }
                        }
                        break;
                }
            }
        }
    }
};