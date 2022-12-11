# Driver service

Driver service is a Nodejs app for managing driver basic data.

## Installation

Install the packages with NPM.

```bash
npm install
```
Create an **.env** file in the project's root folder, and set the following variables:
- MONGO_URL: The connection string of the mongo db
- NODE_ENV: can be **development** or **production** 
- PAYMENTS_SERVICE: The public address of the Payments service (http://payment-address.com) 
- USER_SERVICE: The public address of the Users service (http://users-address.com) 

## Usage
Run automated tests:
```bash
npm run test
```

Start server:
```bash
npm run start
```

Start server in dev mode:
```bash
npm run dev
```

Run linter:
```bash
npm run lint
```

## Run with docker

**Build image:** docker build . -t drivers

**Run container:** 
docker run \\\
-e MONGO_URL=**(connection string)** \\\
-e NODE_ENV=**(development/production)** \\\
-e PAYMENTS_SERVICE=**(payments service url)** \\\
-e USER_SERVICE=**(user service url)** \\\
-p **8080(external):8080(container)** drivers
