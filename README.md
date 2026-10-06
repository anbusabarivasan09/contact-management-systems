# Contact Management System

A simple Contact Management System built using Node.js, Express.js, MongoDB, and Mongoose.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

## Features

- Create a new contact
- View all contacts
- View a single contact
- Update a contact
- Delete a contact
- Phone number validation
- Email validation
- Unique contact ID and email

## Contact Fields

- contactId - Unique string
- name - Required string
- phone - Exactly 10 digits
- email - Valid and unique email

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /contacts | Create a new contact |
| GET | /contacts | Get all contacts |
| GET | /contacts/:id | Get one contact |
| PUT | /contacts/:id | Update a contact |
| DELETE | /contacts/:id | Delete a contact |

## How to Run

Install dependencies:

```bash
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Start the server:

node server.js

The server runs on port 5000.