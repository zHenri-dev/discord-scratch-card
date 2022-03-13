const { connect } = require("mongoose");
const config = require("../config/config.json");
const colors = require("colors");

module.exports = {
    connect() {
        try {
            connect(config.connect_string).finally(console.log(colors.green(`[Database] Conexão com a database efetuada com sucesso!`)));
        } catch {
            console.log(colors.red(`[Database] Ocorreu um erro ao conetar-se a database.`));
        }
    },
};