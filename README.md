# Dronder - Drone Service Marketplace

## Overview

Dronder is a web platform connecting **drone operators** with **individual and business clients** looking for drone services.

Clients can publish service requests and find suitable operators, while operators can browse opportunities, express interest, and build a profile with their experience, equipment, qualifications, and reviews.

## Tech Stack

* **Frontend:** Next.js
* **Backend:** Flask / Python
* **Database:** PostgreSQL
* **Containerization:** Docker

## Key Features

### For Clients

* Create and manage service requests
* Browse interested drone operators
* View operator profiles, qualifications, experience, and reviews
* Review operators after completed jobs

### For Drone Operators

* Create a professional profile
* Add experience, equipment, and certificates
* Browse available service requests
* Express interest in jobs
* Maintain job history and receive reviews

## Running the Application

### Requirements

* Docker
* Docker Compose

### Setup

Clone the repository:

```bash
git clone https://github.com/KingaLukiewicz/dronder-pzsp2.git
cd dronder-pzsp2
```

Create the required `.env` file with the database configuration used by `docker-compose.yaml`.

Start the application:

```bash
docker compose up --build
```

The frontend is available at:

**http://localhost:3000**

To stop the application:

```bash
docker compose down
```

## Authors

* Kinga Łukiewicz
* Julia Czosnek
* Zuzanna Waszczuk
* Filip Kopyt

Developed as a university group project.
