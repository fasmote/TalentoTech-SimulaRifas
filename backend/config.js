const config = {
    development: {
        port: process.env.PORT || 3000,
        jwt_secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro_para_talentotech_2025',
        db_path: process.env.DB_PATH || './database/rifas.db',
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true
        },
        jwt: {
            expiresIn: '24h'
        },
        bcrypt: {
            saltRounds: 10
        }
    },
    
    production: {
        port: process.env.PORT || 3000,
        jwt_secret: process.env.JWT_SECRET,
        db_path: process.env.DB_PATH || './database/rifas.db',
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        },
        jwt: {
            expiresIn: '24h'
        },
        bcrypt: {
            saltRounds: 12
        }
    }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
