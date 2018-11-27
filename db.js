const {
    Pool,
    Client
} = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://axyqzkjrfhdtpz:2fb1252bafa6af329d84e18d4897a5aa1c2bd2ac760d96e624bcbafdc951377b@ec2-54-75-239-237.eu-west-1.compute.amazonaws.com:5432/d6nhkh9m3ihv57";




const db = {}

async function runQuery(query) {
    let respons = null;
    const client = new Client({
        connectionString:connectionString,
        ssl: true
    })

    try {


        await client.connect()

        let res = await client.query(query).then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });

        respons = res.rows;

    } catch (e) {
        console.log("Error ");
        console.log(e);
    }finally {
        client.end();
    }

    return respons;

}
db.insert = async function (query) {
    return await runQuery(query);
}

db.select = async function (query) {
    return await runQuery(query);
}

db.delete = async function (query) {
    return await runQuery(query);
}

db.update = async function (query) {
    return await runQuery(query);
}

module.exports = db