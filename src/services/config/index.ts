import { config as loadEnvConfig } from 'dotenv'

import { ConfigService } from './config.service'

/** Загружаем переменные из .env файла */
const envConfig = loadEnvConfig({ override: true, debug: true }).parsed

const configService = new ConfigService(envConfig)

export { configService, ConfigService }
