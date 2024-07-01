## TODOs
- Refactor:
  - abstract data mapping from character repository
  - Add unit tests
  - Use transactions for multiple DML's
- Add docker for quick setup
- Deploy to AWS (EC2, RDS)
- Use Terraform

## Requirements
Postgres Installed

## Installation

```bash
$ npm install

$ npx prisma generate
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test
```bash
$ migrate:test
# then:

# e2e tests
$ npm run test:e2e
```
