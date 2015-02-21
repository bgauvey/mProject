// config/database.js
module.exports = {
    'connection': {
        'host': process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
        'user': process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'mp_user',
        'password': process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'aSeazeSqpBtGNywm'
    },
	'database': 'mProject',
    'users_table': 'users'
};