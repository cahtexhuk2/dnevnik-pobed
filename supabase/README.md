# Supabase setup

Эта папка готовит "Дневник Побед" к реальному серверному режиму: логин, профили, привычки, победы, раздел "Тень" и хранение фото.

## Шаги подключения

1. Создать новый проект в Supabase.
2. Открыть SQL Editor.
3. Вставить и выполнить содержимое `supabase/schema.sql`.
4. В Project Settings -> API взять:
   - Project URL;
   - anon public key.
5. Скопировать `config.example.js` в `config.js`.
6. Вставить значения:

```js
window.DP_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-public-anon-key",
};
```

После этого в приложении появится статус "Supabase настроен". Следующим шагом нужно подключить JS-клиент Supabase и перенести локальные данные из `localStorage` в таблицы.

## Что создает схема

- `profiles` - профиль пользователя, аватар, год рождения, город, старт пути.
- `habits` - привычки.
- `habit_children` - подпункты составных привычек.
- `habit_checks` - ежедневные отметки.
- `victories` - стена побед.
- `shadow_entries` - раздел "Тень".
- `user_settings` - настройки, включая будущий голос побед.
- `victory-media` - bucket для фото побед и аватарок.

Все таблицы закрыты Row Level Security: пользователь видит и меняет только свои данные.
