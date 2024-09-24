const sql = require('mssql');

class Database {
    #dbConfig= {
        server: 'MZCETDB',
        database: 'CSE8882',
        user: 'MZCET',
        password: 'MZCET@1234',
        options: {
            trustServerCertificate: true
        }
    }

    async #connectToDatabase() {
        try {
            await sql.connect(this.#dbConfig);
            console.log("Connected to database successfully");
        } catch (err) {
            throw err;
        }
    }

    async executeQuery(query, parameters=null) {
        try {
            await this.#connectToDatabase();
            const request = new sql.Request();
            if (parameters) {
                for (const key in parameters) {
                    if (parameters.hasOwnProperty(key)) {
                        request.input(key, parameters[key]['type'], parameters[key]['value']);
                    }
                }
            }
            return request.query(query)
                .then(async records => {
                    return records.recordset;
                })
                .catch(err => {
                    throw err;
                }).finally(()=>sql.close());
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Database;
