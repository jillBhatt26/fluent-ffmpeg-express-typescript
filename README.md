
# Express Video Editor Backend

Basic backend functionality for a video editing web application implemented in Express.js, TypeScript, FFMPEG, PostgreSQL, and Prisma ORM. 


## Tech Stack

Node, Express, TypeScript, PostgreSQL, Prisma ORM, FFMPEG, Supabase


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. Create a new .env file based on the example.env file provided

`NODE_ENV = development`

`PORT = 5000`

`DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DB_NAME?schema=public"`

`SUPABASE_PROJECT_URL = <SUPABASE_PROJECT_URL>`

`SUPABASE_PROJECT_API_KEY = <SUPABASE_PROJECT_API_KEY>`


## Run Locally

Clone the project

```bash
  git clone https://github.com/jillBhatt26/fluent-ffmpeg-express-typescript.git
```

Go to the project directory

```bash
  cd fluent-ffmpeg-express-typescript
```

Install dependencies

```bash
  yarn install --frozen-lockfile
```

Push prisma schema to database

```bash
  npx prisma db push
```

Generate prisma client

```bash
  npx prisma generate
```

Start the server

```bash
  yarn dev
```


## Features

- Upload Video
- Trim Video
- Render Video
- Download Video
- Add subtitles (pending)

