<img src="https://raw.githubusercontent.com/nursandiid/messenger-clone/main/public/images/preview.png">

## Overview
This messenger app offers real-time messaging with a sleek UI design. It supports group chats, one-on-one messaging, and saved messages. Users can see active status and typing indicators, upload attachments, and send emojis. The app also features chat customization, media galleries, and contact list management, all with light and dark theme options.

## Features:
- Real-time messaging using Pusher
- Notification system for messages and sound alerts
- Sleek and intuitive UI design using Tailwind CSS
- Tailwind animations and transition effects
- Full responsiveness for all devices
- Credential authentication facilitated by Laravel Breeze
- Group chats and one-on-one messaging
- Saved Messages to save your messages online like WhatsApp
- Real-time user's active status
- Real-time typing indicator
- Upload attachments (photo/file/etc)
- Send Emoji's
- Chat customization options to personalize the messaging
- Media and popup gallery for easy access to shared content
- Contacts list management for organizing communication channels
- Archive chats for decluttering the interface
- User settings
- Light and dark themes

## Installation
For the installation you can clone this project to your local computer.
```bash
git clone https://github.com/nursandiid/messenger-clone
```

Navigate to the project folder.
```bash
cd messenger-clone
```

Install required packages.
```bash
composer install
npm install
```

Create a new .env file and edit the database credentials.
```bash
cp .env.example .env
```

## Configuration

### Application Settings
```bash
APP_NAME="Chats"
APP_TIMEZONE="Asia/Jakarta"
APP_URL="http://127.0.0.1:8000"
```

### Database Connection
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=messenger_clone
DB_USERNAME=root
DB_PASSWORD=
```

### Queue Connection
In this case, you can set the value to `database`.

```bash
QUEUE_CONNECTION=database
```

### Pusher Connection
Use your credentials to run your project.

```bash
BROADCAST_CONNECTION=pusher

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## Run Commands
Generate new app key:
```bash
php artisan key:generate
```

Run migrations:
```bash
php artisan migrate
```

Run seeders:
```bash
php artisan db:seed
```

Generate a symlink to view files in storage:
```bash
php artisan storage:link
```

Run the task scheduler in development mode:
```bash
php artisan schedule:work
```

If you're using cron jobs, add this command to your crontab:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Build assets with NPM:
```bash
npm run build
```

Alternatively, run in development mode:
```bash
npm run dev
```

Run your app:
```bash
php artisan serve
```

That's it! Launch the main URL at http://127.0.0.1:8000