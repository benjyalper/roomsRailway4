// knexfile.js

module.exports = {
    development: {
        // your development configuration
    },
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL, // or your production database connection string
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
        },
    },
};
