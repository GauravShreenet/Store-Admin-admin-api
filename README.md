# E-Commerce Fashion Web App

Welcome to the Store Admin API project! This project aims to provide a robust backend for managing an e-commerce website's administrative tasks. It supports functionalities such as product management, category management, order management, and user management. Built with Node.js and Express, this API ensures efficient and scalable performance. This is the api server of [Frontend Repo](https://github.com/GauravShreenet/Store-Admin-CMS-client)

## Features

- **CRUD Product Management**: Create, read, update, and delete products in the inventory.
- **CRUD Category Management**: Manage product categories to keep the inventory organized.
- **Order Management**: View and manage customer orders, update order status.
- **User Management**: Handle user authentication and manage user roles and permissions.
- **Admin Management**: Admins can create, read, update, and delete other admin users.

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Dotenv**: For loading environment variables from a .env file.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository to your local machine:** `git clone https://github.com/GauravShreenet/Store-Admin-admin-api`
2. **Navigate to the project directory:** `cd Store-Admin-API`
3. **Install dependencies:** `npm install`
4. Rename `.env.sample` to `.env` and configure the environment variables accordingly.
5. **Start the development server:** `npm run dev`
6. The server should be running at [`http://localhost:8000`](http://localhost:8000).

## Available APIs
All the api segmentation path are followed by `http://localhost:8000/ap/v1`

### User API
User api will follow the following parttern `http://localhost:8000/ap/v1/users`

| #   | PATH             | METHODS | PRIVATE | DESCRIPTION                                                                                           |
| --- | ---------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------- |
| 1.  | `/`              | `POST`  | False   | Server expects the user object and creates a new user in the db                                        |
| 2.  | `/verify-email`  | `POST`  | False   | Verifies the user's email address through a verification link sent to the user's email                |
| 3.  | `/sign-in`       | `POST`  | False   | Authenticates the user and returns JWT tokens for session management                                   |
| 4.  | `/`              | `GET`   | True    | Returns the user data for the authenticated admin                                                     |
| 5.  | `/get-accessjwt` | `GET`   | True    | Refreshes and returns a new access JWT                                                                 |
| 6.  | `/logout`        | `POST`  | True    | Logs out the user and invalidates the session                                                          |
| 7.  | `/request-otp`   | `POST`  | False   | Sends an OTP to the user's email for password reset                                                    |
| 8.  | `/`              | `PATCH` | False   | Resets the user's password using the provided OTP                                                      |
| 9.  | `/password`      | `PATCH` | True    | Updates the authenticated user's password                                                              |
| 10. | `/user-profile`  | `PATCH` | True    | Updates the authenticated user's profile information                                                   |

### Category API
Category api will follow the following parttern `http://localhost:8000/ap/v1/categories`

| #   | PATH             | METHODS | PRIVATE | DESCRIPTION                                                     |
| --- | ---------------- | ------- | ------- | --------------------------------------------------------------- |
| 1.  | `/`              | `POST`  | True    | Creates a new category with the given title and generates a slug |
| 2.  | `/:_id?`         | `GET`   | False   | Retrieves all categories or a specific category by its ID        |
| 3.  | `/`              | `PUT`   | True    | Updates a category's status and title                            |
| 4.  | `/:_id`          | `DELETE`| True    | Deletes a category by its ID                                     |

### Product API
Category api will follow the following parttern `http://localhost:8000/ap/v1/products`

| #   | PATH             | METHODS | PRIVATE | DESCRIPTION                                                     |
| --- | ---------------- | ------- | ------- | --------------------------------------------------------------- |
| 1.  | `/`              | `POST`  | True    | Creates a new product with the given details and uploads images |
| 2.  | `/`              | `PUT`   | True    | Updates an existing product's details and images                |
| 3.  | `/:_id?`         | `GET`   | False   | Retrieves all products or a specific product by its ID          |
| 4.  | `/:_id`          | `DELETE`| True    | Deletes a product by its ID                                     |

## Usage
Once the server is running, you can interact with the API through HTTP requests. Use tools like Postman or use rest.http an extension in visual studio code to test the various endpoints.

## License
This project is licensed under the MIT License.

## Acknowledgements
This project was inspired by the need for a robust and efficient backend for e-commerce administration. Special thanks to the Node.js, Express, MongoDB, and JWT communities for their valuable contributions.
