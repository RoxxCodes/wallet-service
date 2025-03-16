# Wallet API (Node.js + MySQL + Docker + Sequelize)

This is a **Wallet API** built using **Node.js, Express, MySQL, Sequelize, and Docker**.  
It supports **wallet creation, transactions, and database migrations**.

## Features
- **Wallet Management** (Create Wallet, Fetch Wallet Details)
- **Transactions** (Credit/Debit Money, Fetch Transactions)
- **Sequelize Migrations** (Database Schema Management)
- **Dockerized Setup** (Runs in Containers with MySQL)
- **Paginations** for Transactions

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Containerization:** Docker, Docker Compose
- **Security:** Helmet, CORS
- **Logging:** Winston

---

## Project Setup (Local)
### 1. Clone Repository
```sh
git clone https://github.com/your-repo/wallet-api.git
cd wallet-api
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure DB creds
Update config/ files for DB creds and server port


### 4. Run the App Locally
```sh
npm run deploy
```
API is now running on **http://localhost:3000**

---

## Run with Docker
### 1. Build & Start Containers
```sh
docker-compose up --build
```
This will:
- Start MySQL in Docker
- Run pending database migrations
- Start the Wallet API

### 2. Verify Running Containers
```sh
docker ps
```

### 3. Check Logs
```sh
docker logs wallet-api
```

### 4. Stop Containers
```sh
docker-compose down
```

---

## API Endpoints
### Wallet API
| Method | Endpoint                | Description            |
|--------|-------------------------|------------------------|
| **POST** | `/api/v1/wallets`       | Create a new wallet    |
| **GET**  | `/api/v1/wallets/:id`   | Get wallet details     |

API: GET - http://localhost:3000/api/v1/wallet/${walletId}
```json
    {
        "id": "eadaf3f0-084c-4cbc-9e66-e8d681e8eadc",
        "name": "Hello world",
        "balance": "80.0000",
        "createdAt": "2025-03-15T17:58:42.000Z",
        "updatedAt": "2025-03-15T17:59:10.000Z"
    }
```

#### Request Body Example (Create Wallet)
API: POST - http://localhost:3000/api/v1/wallet/setup
```json
    {
    "name": "John Doe",
    "balance": 100.00
    }
    ```
    #### Response Example
    ```json
    {
    "id": "b3f2a4d3-1a52-4e4b-9b3e-8b5d4e2a5c2a",
    "name": "John Doe",
    "balance": 100.00,
    "createdAt": "2025-03-15T12:00:00.000Z",
    "updatedAt": "2025-03-15T12:00:00.000Z"
    }
```

### Transaction API
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| **POST** | `/api/v1/transactions/:walletId`         | Add a transaction (credit/debit)    |
| **GET**  | `/api/v1/transactions?walletId=123&limit=5&lastId=tx1005` | Fetch paginated transactions |

#### Request Body Example (Add Transaction)
API: POST http://localhost:3000/api/v1/transaction/eadaf3f0-084c-4cbc-9e66-e8d681e8eadc
```json
    {
        "amount": 50,
        "description": "Recharge"
    }
```
#### Response Example
```json
    {
    "id": "txn12345",
    "walletId": "b3f2a4d3-1a52-4e4b-9b3e-8b5d4e2a5c2a",
    "type": "credit",
    "amount": 50.00,
    "createdAt": "2025-03-15T12:05:00.000Z",
    "updatedAt": "2025-03-15T12:05:00.000Z"
    }
```

API: GET http://localhost:3000/api/v1/transactions?walletId=123&limit=5&skip=0

Response
``` json
    {
        "walletId": "eadaf3f0-084c-4cbc-9e66-e8d681e8eadc",
        "currentPage": 1,
        "totalRecords": 2,
        "transactions": [
            {
                "id": "f0e8b2da-8a0c-4efe-b8c6-6cfb3be139d6",
                "walletId": "eadaf3f0-084c-4cbc-9e66-e8d681e8eadc",
                "amount": "50.0000",
                "balance": "80.0000",
                "description": "Recharge",
                "type": "CREDIT",
                "createdAt": "2025-03-15T17:59:10.000Z",
                "updatedAt": "2025-03-15T17:59:10.000Z"
            },
            {
                "id": "3fc1b43c-cabc-4546-97f1-45f12e67ab15",
                "walletId": "eadaf3f0-084c-4cbc-9e66-e8d681e8eadc",
                "amount": "30.0000",
                "balance": "30.0000",
                "description": "Initial Deposit",
                "type": "CREDIT",
                "createdAt": "2025-03-15T17:58:42.000Z",
                "updatedAt": "2025-03-15T17:58:42.000Z"
            }
        ],
        "hasMore": false
    }
```

---


## 🔄 Database Migrations
### Generate a New Migration
```sh
npx sequelize-cli migration:generate --name add-column-to-transactions
```
This creates a file inside `migrations/`.

### Apply Migrations
```sh
npx sequelize-cli db:migrate
```

### Undo the Last Migration
```sh
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations
```sh
npx sequelize-cli db:migrate:undo:all
```

---

## 📌 Sequelize Migration Examples

### **1️⃣ Adding a New Column (`transactionType` in `Transactions`)**
```sh
npx sequelize-cli migration:generate --name add-column-to-transactions
```
Modify the generated migration file:
```js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Transactions", "transactionType", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "debit",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Transactions", "transactionType");
  },
};
```
Run migration:
```sh
npx sequelize-cli db:migrate
```

---

### **2️⃣ Creating a New Table (`Accounts`)**
```sh
npx sequelize-cli migration:generate --name create-accounts-table
```
Modify the generated migration file:
```js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Accounts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      accountType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Accounts");
  },
};
```
Run migration:
```sh
npx sequelize-cli db:migrate
```

---

### **3️⃣ Updating an Existing Column (`amount` in `Transactions`)**
```sh
npx sequelize-cli migration:generate --name update-amount-column-in-transactions
```
Modify the generated migration file:
```js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.DECIMAL(15, 4),
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },
};
```
Run migration:
```sh
npx sequelize-cli db:migrate
```
