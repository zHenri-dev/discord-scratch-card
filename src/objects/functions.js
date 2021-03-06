module.exports = class Functions {
    constructor(client) {
        this.client = client;
    }

    async getFormattedTime(time) {
        try {
            if (!time) return undefined;
            time = parseInt(time) - new Date().getTime();
            let formatted = [];
            let days = Math.floor(time / (60 * 60 * 24 * 1000));
            if (days > 0) { time = time - (days * (60 * 60 * 24 * 1000)); if (days == 1) { formatted.push(`${days} dia`) } else { formatted.push(`${days} dias`) }; };
            let hours = Math.floor(time / (60 * 60 * 1000));
            if (hours > 0) { time = time - (hours * (60 * 60 * 1000)); if (hours == 1) { formatted.push(`${hours} hora`) } else { formatted.push(`${hours} horas`) }; };
            let minutes = Math.floor(time / (60 * 1000));
            if (minutes > 0) { time = time - (minutes * (60 * 1000)); if (minutes == 1) { formatted.push(`${minutes} minuto`) } else { formatted.push(`${minutes} minutos`) }; };
            let seconds = Math.floor(time / 1000);
            if (seconds > 0) { time = time - (seconds * (60 * 1000)); if (seconds == 1) { formatted.push(`${seconds} segundo`) } else { formatted.push(`${seconds} segundos`) }; };
            let returnString = formatted.join(", ");
            if (formatted.length > 1) {
                let last = formatted.pop();
                returnString = formatted.join(", ") + " e " + last;
            }
            return returnString;
        } catch (error) {
            console.log(error);
        }
    }

    async buyScratchCard(user) {
        let emojis = [];
        for (let x = 0; x < 9; x++) {
            let random = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            if (random == 1) emojis.push(`||<:thumbsup_henri:${this.client.customEmojis.thumbsup_henri}>||`);
            if (random == 2) emojis.push(`||<:middle_finger_henri:${this.client.customEmojis.middle_finger_henri}>||`);
            if (random == 3) emojis.push(`||<:henribaleia:${this.client.customEmojis.henribaleia}>||`);
            if (random == 4) emojis.push(`||<:henricara:${this.client.customEmojis.henricara}>||`);
            if (random == 5) emojis.push(`||<:beluga:${this.client.customEmojis.beluga}>||`);
            if (random == 6) emojis.push(`||<:que:${this.client.customEmojis.que}>||`);
        }
        let content = `${user} **aqui est?? sua raspadinha!**\n\nRaspe clicando na parte cinza e, se o seu cart??o for premiado com combina????es de emojis na horizontal/vertical/diagonal, clique em ???? para receber a sua recompensa! Mas cuidado, n??o tente resgatar pr??mios de uma raspadinha que n??o tem pr??mios!!\nSe voc?? quiser comprar um novo ticket pagando **150 moedas**, aperte em ????!\n\n`;
        let count = 0;
        emojis.forEach(emoji => {
            if (count >= 3) { content = content + "\n"; count = 0; }
            content = content + emoji;
            count++;
        });
        return content;
    }

    async getAmount(type) {
        if (type == `<:thumbsup_henri:${this.client.customEmojis.thumbsup_henri}>`) return 100000;
        else if (type == `<:middle_finger_henri:${this.client.customEmojis.middle_finger_henri}>`) return 10000;
        else if (type == `<:henribaleia:${this.client.customEmojis.henribaleia}>`) return 1000;
        else if (type == `<:henricara:${this.client.customEmojis.henricara}>`) return 375;
        else if (type == `<:beluga:${this.client.customEmojis.beluga}>`) return 250;
        else if (type == `<:que:${this.client.customEmojis.que}>`) return 100;
        else return 0;
    }
};