import { ObjectSchema } from 'joi'

export class ConfigService {
  constructor(private readonly config: Record<string, unknown>) {}

  /** Валидирует конфиг по указанной схеме и возвращает его */
  validateConfig<T extends object>(schema: ObjectSchema): T {
    const result = schema.validate(this.config, {
      /** оставляет только ожидаемые ключи */
      stripUnknown: true,
      /** выводит все ошибки, а не только первую */
      abortEarly: false,
    })

    if (result.error) {
      throw result.error.details
    }

    return result.value
  }
}
