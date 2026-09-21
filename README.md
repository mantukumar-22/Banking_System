
// Bank System API
This is a simple RESTful API for a bank system built using Node.js and Express. It allows users to create accounts, view account details, and perform transactions such as deposits and withdrawals.
## Features
- Create a new bank account
- View account details
- Deposit money into an account
- Withdraw money from an account
- View transaction history
## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Navigate to the project directory:
   ```bash
    cd bankSystem
3. Install dependencies:
   ```bash
    npm install
4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    ```
# Role-based Access Control (RBAC)
This API implements role-based access control (RBAC) to manage permissions for different user roles. The following roles are defined:
- **Admin**: Has full access to all endpoints and can manage user accounts and transactions.
- **User**: Can view their own account details and perform transactions on their account.
- **Guest**: Can only view public information and cannot perform any transactions.
## Usage
1. Start the server:
   ```bash
    npm start
2. Use an API client (like Postman) to interact with the endpoints. Make sure to include the appropriate authentication token in the headers for protected routes.
## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the coding standards and include tests for any new features or bug fixes.