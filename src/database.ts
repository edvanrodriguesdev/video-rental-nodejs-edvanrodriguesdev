import { Client } from 'pg'

const client: Client = new Client({
    user: 'edvan',
    password: 'golf',
    host: 'localhost',
    database: 'entrega_sprint2',
    port: 5432
})

const startDatabase = async(): Promise<void> => {
    await client.connect()
    console.log('Database connected!')
}

export { client, startDatabase }