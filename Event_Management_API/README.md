# Event Management API

A simple Express.js REST API for managing events and attendees. The project uses in-memory data stores and includes basic authentication and request logging.

## Project Overview

This API allows you to:

- Create, view, update, and delete events
- Register attendees for events
- Check available seats for each event
- Filter attendees by event ID
- Protect write operations with a simple auth middleware

## Folder Structure

- app.js - Application entry point and server setup
- controllers/ - Request handlers for events and attendees
- middleware/ - Authentication and logging middleware
- model/ - In-memory data for events and attendees
- routes/ - Route definitions for the API
- log.txt - Request log output
- package.json - Project dependencies and scripts

## Installation

1. Clone or open the project folder.
2. Install dependencies:

```bash
npm install
```

## How to Run

Start the server with:

```bash
node app.js
```

The server will run on:

```text
http://localhost:8000
```

> Protected routes require an Authorization header with the value `admin123`.

## API Endpoints

### Events

- GET /events - Get all events
- GET /events/:id - Get one event by ID
- POST /events - Create a new event
- PATCH /events/:id - Update an event
- DELETE /events/:id - Delete an event

### Attendees

- POST /attendees - Register a new attendee
- GET /attendees - Get all attendees
- GET /attendees?eventId=evt_001 - Get attendees for a specific event

## Sample Requests

### Get all events

```bash
curl http://localhost:8000/events
```

### Create an event

```bash
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: admin123" \
  -d '{
    "title": "Tech Meetup",
    "date": "2026-09-10",
    "venue": "Nairobi Innovation Hub",
    "seatsAvailable": 100
  }'
```

### Get an event by ID

```bash
curl http://localhost:8000/events/evt_001
```

### Register an attendee

```bash
curl -X POST http://localhost:8000/attendees \
  -H "Content-Type: application/json" \
  -H "Authorization: admin123" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "eventId": "evt_001"
  }'
```

### Get attendees for a specific event

```bash
curl "http://localhost:8000/attendees?eventId=evt_001"
```

## Notes

- The app currently stores data in memory, so data will reset when the server restarts.
- The logger writes request activity to the log.txt file.
