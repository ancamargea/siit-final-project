# SIIT - WEB COMPLETE - FINAL PROJECT

SpinPoint is a CRUD React web application built with TypeScript.

## Description

Whether you're chasing rare discs or just love browsing through crates, SpinPoint helps you discover your next vinyl spot — and share it with fellow collectors. Store owners can list, update, and manage their record shops, while other registered users can browse, review, and rate record stores across different cities. This app is built to connect Romania’s vinyl community — from seasoned collectors to newcomers — all in one place.

## Features

- User registration and login with role-based access (store owners and regular users)
- Owners can add or edit their record stores
- Users can browse stores, leave reviews, ratings, and delete their reviews
- Responsive design with form validation
- Protected routes
- Backend mocked with JSON Server running on port 4000

## Technologies Used

### Frontend

- React.js with TypeScript
- React Router for navigation
- Form validation using Zod schema
- Vanilla CSS for styling

### Backend

- JSON Server for mocking REST API endpoints
- Backend based on Node.js with authentication, role-based access, and protected routes for store owners

### Other technologies

CRUD Functionality:

- Create – Users can add stores (owners) and reviews (all logged-in users).
- Read – All users can view stores and their reviews; admin dashboard lists owner’s stores with review stats.
- Update – Owners can edit their stores; users can update their profile info.
- Delete – Users can delete their own reviews; owners manage their stores.
