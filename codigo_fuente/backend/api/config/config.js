require('dotenv').config();

// DESPUES VER TEMA PUERTOS EN DOCKER Y EN EL DOCKER-COMPOSE
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER || 'admin',
  dbPassword: process.env.DB_PASSWORD || 'admin123',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME || 'ecopark_db'
}

module.exports = config;
