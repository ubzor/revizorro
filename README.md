# Nuxt Prisma Lucia-auth boilerplate

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

Create `.env` file:

```bash
cp .env.example .env
```

Create `prisma/users.json` file:

```bash
cp ./prisma/users.json.example ./prisma/users.json
```

Create the database:

```bash
yarn migrate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev --open
```

## GraphQL Explorer

Available on `http://localhost:3000/api/graphql` in Dev mode.

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
