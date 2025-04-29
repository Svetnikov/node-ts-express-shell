import { envs } from "../../config/envs"
import { MongoDatabase } from "../mongo/mongo-database"

(async ()=> {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })

    await main()

    MongoDatabase.
})()

async function main() {}