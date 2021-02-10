# Starship Kafka App

## Description

This app is composed of:

### Backend

A NestJS hybrid microservice handling http requests, Kafka events, and web socket events. A basic starship class is used to mock a datastore. - It exposes the following routes: - `GET /starships`: Returns a list of starships - `GET /starships/:id`: Returns a starship with the maching id - `POST /starships`: Creates a starship - Body: `{ model: string, name: string}` - `DELETE /starships/:id`:

### Front-end

A react create-react-app which lists page 1 of the starships from SWAPI. Opens a socket to the server listening to the starships create, update, and delete events.

## Installation

Prerequisites:

- Docker
- Node 12
- Yarn or NPM

1. Install all prerequisites
2. Clone this repo
3. `cd` to root directory
4. Install dependencies in both `/client` and `/server` by running `yarn` or `npm install` in each directory
5. Start kafka in a new terminal window by running `docker-compose up` in `/docker`
   - port `9094` by default
6. Start the server in a new terminal by running `yarn start` in `/server`
   - port `3001` by default, websocket on `4001`
7. Start the client in a new terminal by running `yarn start` in `/client`
   - port `3000` by default
