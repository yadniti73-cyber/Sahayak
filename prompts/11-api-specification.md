# Sahayak — API Specification

Version: 1.0

This document defines all REST API endpoints used by the application.

All APIs follow REST principles.

Every response must use the same response format.

---

# Base URL

/api

---

# Response Format

Success

{
  "success": true,
  "message": "Operation successful.",
  "data": {}
}

Failure

{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}

---

# Authentication APIs

POST /api/auth/register

Purpose

Register new user.

Validation

Name

Email

Password

Role

Phone

City

Returns

User

JWT Cookie

---

POST /api/auth/login

Purpose

Authenticate user.

Returns

JWT Cookie

Current User

---

POST /api/auth/logout

Purpose

Logout current user.

---

GET /api/auth/me

Purpose

Return authenticated user.

---

# Mentor APIs

GET /api/mentors

Supports

Search

Pagination

Sorting

Filtering

Query Parameters

page

limit

category

city

language

rating

price

mode

experience

verified

sort

q

---

GET /api/mentors/:id

Returns

Complete mentor profile

Availability

Reviews

Rating

Session Modes

---

POST /api/mentors

Protected

Mentor Only

Creates mentor profile.

---

PATCH /api/mentors/:id

Protected

Update mentor profile.

---

DELETE /api/mentors/:id

Soft delete only.

---

# Category APIs

GET /api/categories

Returns

All active categories.

---

GET /api/categories/:slug

Returns

Category

Featured mentors

Statistics

---

# Booking APIs

POST /api/bookings

Creates booking request.

Validation

Mentor

Date

Time

Session Mode

---

GET /api/bookings

Returns

Bookings belonging to authenticated user.

---

GET /api/bookings/:id

Returns booking details.

---

PATCH /api/bookings/:id

Allowed

Accept

Reject

Cancel

Complete

Reschedule

---

# Review APIs

POST /api/reviews

Completed bookings only.

---

GET /api/reviews

Returns mentor reviews.

---

# Favorites

GET /api/favorites

POST /api/favorites

DELETE /api/favorites/:mentorId

---

# Profile APIs

GET /api/profile

PATCH /api/profile

DELETE /api/profile

---

# Notification APIs

GET /api/notifications

PATCH /api/notifications/:id/read

PATCH /api/notifications/read-all

---

# Search

Supports

Full text

Partial match

Fuzzy search

---

# Pagination

page

limit

totalPages

totalItems

currentPage

---

# Sorting

Newest

Rating

Experience

Price

Popularity

Alphabetical

---

# Status Codes

200

Created

201

Bad Request

400

Unauthorized

401

Forbidden

403

Not Found

404

Conflict

409

Validation Error

422

Internal Error

500

---

# Validation

Every endpoint validates

Headers

Query

Body

Params

Authorization

---

# Security

JWT

Rate Limiting

Origin Check

Input Sanitization

Ownership Verification

---

# Future APIs

Payments

Messages

Communities

Video Calls

Certificates

Events

AI Assistant