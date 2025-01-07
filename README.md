# Xyntra Web Bank App

The `xyntra_web_bank_app` is a modern web application designed to provide a seamless banking experience. It allows users to manage their bank accounts, view transaction history, transfer funds, and more. The application is built using Next.js, TypeScript, Tailwind CSS, and integrates with various third-party services like Plaid and Dwolla for banking functionalities.

## Key Features

1. **User Authentication**:
   - Users can sign up and sign in using email and password.
   - User sessions are managed using Appwrite.

2. **Bank Account Management**:
   - Users can link their bank accounts using Plaid.
   - View details of linked bank accounts.
   - Display bank account balances and transaction history.

3. **Transaction Management**:
   - View recent transactions and categorize them.
   - Transfer funds between accounts using Dwolla integration.

4. **Responsive Design**:
   - The application is designed to be responsive and works well on both desktop and mobile devices.

## Project Structure

The project is organized into several key directories and files:

- **`app/`**: Contains the main application components and pages.
  - **`(auth)/`**: Authentication-related pages like sign-in and sign-up.
  - **`(root)/`**: Main application pages like home, transaction history, and payment transfer.
  - **`globals.css`**: Global CSS styles for the application.

- **`components/`**: Reusable UI components used throughout the application.
  - **`ui/`**: UI-specific components like buttons, forms, and tables.
  - **`BankCard.tsx`**: Component to display bank card information.
  - **`Pagination.tsx`**: Component for pagination controls.
  - **`AuthForm.tsx`**: Component for authentication forms.

- **`constants/`**: Contains constant values used across the application.
  - **`index.ts`**: Defines various constants like sidebar links and category styles.

- **`lib/`**: Utility functions and actions for interacting with external services.
  - **`actions/`**: Contains actions for interacting with Appwrite, Plaid, and Dwolla.
  - **`utils.ts`**: Utility functions for formatting and other common tasks.

- **`public/`**: Static assets like images and icons.

- **`types/`**: TypeScript type definitions for the application.

- **`next.config.mjs`**: Next.js configuration file.

- **`.env.example`**: Example environment variables file.

## Key Integrations

- **Appwrite**: Used for user authentication and database management.
- **Plaid**: Used for linking bank accounts and retrieving account information.
- **Dwolla**: Used for transferring funds between accounts.
- **Sentry**: Used for error tracking and monitoring.

## Configuration

The application uses environment variables to configure various services. These variables are defined in the `.env` file. An example configuration is provided in the `.env.example` file.

## Running the Project

To run the project locally, follow these steps:

1. **Install Dependencies**:
   ```sh
   npm install

2. **Set Up Environment Variables**: Copy the .env.example file to .env and fill in the required values.

3. **Run the Development Server**:
npm run dev

4. **Build the Project**:
npm run build

5. **Start the Production Server**:
npm start

