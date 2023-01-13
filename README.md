# README

## Project setup

Install dependencies:

```bash
yarn install
```


Init database(postgresql):

```bash
# skipped installing psql and create user and database
psql -p 5432 -h 127.0.0.1 -U web3 -d learning -f ./decert.sql;
```


Start the backend service:

```bash
yarn start

```
