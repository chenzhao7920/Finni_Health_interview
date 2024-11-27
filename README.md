# Full_Stack_interview_demo
Full stack app using React, node.js, express, postgreSQL and Docker

# Getting Started
Follow these steps to run the project locally using Docker or Node.js:

## Run with Docker Compose

In the project directory, you can use docker compose command to create app container:
### ```docker compose up --build```
This will:

Build and start the Frontend, Backend, and Database services.
Map the services to the following URLs:
Frontend: http://localhost:3000
Backend: http://localhost:5000

## Run Locally Without Docker
You can also run the frontend and backend independently without using Docker.

In frontend folder
### `cd frontend`
### `npm install`
### `npm start`
The frontend will be accessible at http://localhost:3000

In server folder
### `cd server`
### `npm install`
### `npm start`
The backend will be accessible at http://localhost:5000