# База данных

## Подключение

Рекомендуемый клиент для подключения [HeidiSQL](https://www.heidisql.com/download.php).

## Создание

- База

```sql
CREATE DATABASE mira;
```

- Пользователь

```sql
CREATE USER mira WITH PASSWORD '';
```

- Права

```sql
GRANT ALL PRIVILEGES ON DATABASE "mira" TO "mira";
```
