# BiteEat

BiteEat is a full-stack food video app with two account types:

- **Users** can register, log in, browse food videos, like items, and save items.
- **Food partners** can register, log in, create food posts, and manage their account profile.

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express + MongoDB backend

## Folder structure

### Client

- `client/src/components/` — shared UI components like bottom nav, reel feed, and loader
- `client/src/pages/auth/` — auth pages, auth context, auth hook, and auth services
- `client/src/pages/general/` — general user-facing pages like home, saved, and account profile
- `client/src/pages/food-partner/` — food partner pages, food context, hook, and services
- `client/src/routes/` — app routing and protected route handling
- `client/src/styles/` — shared styles for auth, profile, loader, reels, and theme

### Server

- `server/src/controllers/` — request handlers for auth and food APIs
- `server/src/routes/` — Express route definitions
- `server/src/models/` — Mongoose models
- `server/src/middlewares/` — authentication middleware
- `server/src/services/` — external service integration such as ImageKit upload
- `server/src/db/` — MongoDB connection setup
- `server/src/app.js` — Express app configuration
- `server/server.js` — app entry point

## Tech stack

### Frontend

- React
- React Router
- Axios
- Vite

### Backend

- Express
- MongoDB + Mongoose
- JWT auth with cookies
- Multer
- ImageKit

## Features

- Separate user and food-partner authentication
- Protected routes in the frontend router
- Profile page with logout
- Food feed, saved videos, likes, and partner profile pages
- Food creation with video upload
- Context + custom hook architecture for auth and food flows

## Feature updates

- Added centralized route protection inside `AppRoutes.jsx`
- Added account profile page for both users and food partners
- Added logout flow with redirect handling based on account type
- Refactored API calls into `services -> context -> hook -> UI`
- Added themed loading screen for lazy-loaded pages and auth checks
- Added full-project documentation at the repository root

## Getting started

### 1. Install dependencies

Run these commands in separate terminals:

- `cd client && npm install`
- `cd server && npm install`

### 2. Create server environment variables

Copy the `.env.example` file in the `server/` directory to `.env` and fill in the values:

- `PORT=3000`
- `MONGODB_URL=your_mongodb_connection_string`
- `JWT_SECRET=your_jwt_secret`
- `IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key`
- `IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key`
- `IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint`

## Running the project

### Start the backend

- `cd server`
- `npm run dev`

### Start the frontend

- `cd client`
- `npm run dev`

Frontend default URL:

- `http://localhost:5173`

Backend default URL:

- `http://localhost:3000`

## Available scripts

### Client

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

### Server

- `npm run dev`
- `npm start`

## API overview

### Auth routes

- `POST /api/auth/user/register`
- `POST /api/auth/user/login`
- `GET /api/auth/user/logout`
- `GET /api/auth/user/me`
- `POST /api/auth/food-partner/register`
- `POST /api/auth/food-partner/login`
- `GET /api/auth/food-partner/logout`
- `GET /api/auth/food-partner/me`

### Food routes

- `GET /api/food`
- `POST /api/food`
- `POST /api/food/like`
- `GET /api/food/save`
- `POST /api/food/save`
- `GET /api/food/partner/:id`

## Notes

- The frontend sends authenticated requests with cookies.
- The backend currently allows CORS from `http://localhost:5173`.
- Video uploads use ImageKit, so valid ImageKit credentials are required.