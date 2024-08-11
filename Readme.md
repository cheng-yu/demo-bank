## Descritpion
A demo backend server of a simple bank account system.

There are two modules Account and TransferRequest in the system.

**Account module** is design for managing the account, providing functions include ***create account***, ***list accounts*** and ***get account detail***.

**TransferRequest module** is design for managing the money transfering within accounts, providing functions include ***create request***, ***list requests***, ***get request detail*** and ***perform transfering***.

## API
Can import `demo-bank.postman_collection.json` to Postman.
### Account
- 1.1 create account
  - path: `POST /accounts`
  - request body:
    - name `String`
    - balance `Integer`
- 1.2 list accounts
  - path: `GET /accounts`
- 1.3 get account
  - path `GET /accounts/:id`
### TransferRequest
- 2.1 create request
  - path: `POST /transfer-requests`
  - request body:
    - type: `String [ deposit | withdraw | transfer ]` 
    - fromAccountId: `uuid`
    - toAccountId: `uuid`
    - amount: `Integer`
- 2.2 list requests
  - path: `GET /transfer-requests`
- 2.3 get request detail
  - path: `GET /transfer-requests/:id`
- 2.4 perform transfering
  - path: `POST /transfer-requests/:id/perform`

## Run The App
- `cd {project path}`
- `docker build -t demo-bank:latest .`
- `docker run -p 3000:3000 --rm demo-bank:latest`

## Testing
- `cd {project path}`
- `npm install`
- `npx jest`

## TODO
- user management
- account event record
  - transaction recovery
- params check
