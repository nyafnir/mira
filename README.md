# Мира | Discord-бот

## Функционал

- Роли по реакции

## Особенности

- Окружение можно поднять в докере
- Взаимодействие некоторых вещей по шине событий
- Своеобразная инициализация команд

## Установка и запуск

- Поднимаем окружение (база данных **postgres** и кэш **redis**):

```sh
sh ./docker/scripts/up.sh # предусловие: установлен docker
```

- Устанавливаем **NodeJS** (минимальная версия указана в файле `.nvmrc`):

```sh
nvm install # предусловие: установлен nvm
```

```sh
yarn install --prod # устанавливаем обязательные зависимости (игнорируем зависимости для ведения разработки)
yarn build # собираем проект
```

- Используем настройки по умолчанию:

```sh
cp .env.example .env # пересохраняем файл `.env.example` как `.env`
```

- [Создаём бота, если его у вас ещё нет](https://discord.com/developers/applications).
- В настройках указываем свои `BOT_TOKEN` и `BOT_ID`.
- Выгружаем команды **в глобальное меню** дискорда:

```sh
yarn cli:prod
```

- Запускаем бота:

```sh
yarn start:prod
```
