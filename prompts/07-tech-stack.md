# Sahayak — Technology Stack & Engineering Standards

Version: 1.0

This document defines the engineering architecture for Sahayak.

It is the source of truth for every technical decision.

If another document conflicts with this one regarding implementation details, this document takes precedence.

---

# Engineering Philosophy

Sahayak should be engineered like a production SaaS application.

The codebase should prioritize:

• Maintainability

• Scalability

• Performance

• Security

• Readability

• Reusability

• Testability

The goal is to create software that can be maintained by a professional engineering team for years.

---

# Core Technology Stack

Framework

Next.js 15+

App Router

JavaScript only

No TypeScript.

---

Frontend

React 19

Tailwind CSS

Framer Motion

Lucide React

React Hook Form

Zod

clsx

tailwind-merge

date-fns

---

Backend

Next.js Route Handlers

Server Actions where appropriate

JWT Authentication

bcryptjs

Mongoose

MongoDB

Node.js Runtime

---

Database

MongoDB Atlas

Development

MongoDB Local

ODM

Mongoose

Never use Prisma.

---

Authentication

JWT

httpOnly Cookies

bcrypt password hashing

Role-based authorization

Protected middleware

Refresh token support (future)

OAuth (future)

---

Deployment

Frontend

Vercel

Backend

Next.js Server

Database

MongoDB Atlas

Media

Cloudinary (future)

Emails

Resend (future)

Payments

Razorpay (future)

---

# Architecture

Follow Feature-Based Architecture.

Do NOT organize by file type.

Bad

components/

pages/

hooks/

utils/

Good

features/

shared/

lib/

models/

services/

Every feature owns its own UI, hooks, services, validation, and helpers.

---

# Recommended Folder Structure

src/

app/

features/

shared/

components/

hooks/

lib/

models/

services/

repositories/

validators/

middleware/

config/

constants/

utils/

public/

styles/

---

# Feature Modules

Authentication

Mentors

Bookings

Dashboard

Categories

Profile

Notifications

Admin

Each module should be independent.

Never tightly couple modules together.

---

# Data Layer

Use Mongoose.

Every collection should have:

Schema

Model

Indexes

Validation

Timestamps

Virtuals where appropriate

Methods

Statics when needed

Never access MongoDB directly inside UI components.

---

# Repository Pattern

Database access belongs only inside repositories.

Example

UserRepository

BookingRepository

MentorRepository

CategoryRepository

Repositories should never contain business logic.

Only database operations.

---

# Service Layer

Business logic belongs inside services.

Example

BookingService

AuthenticationService

MentorService

SearchService

NotificationService

Services call repositories.

Pages never call repositories directly.

---

# API Layer

Route Handlers should be thin.

Responsibilities

Validate input

Authenticate

Call service

Return response

Nothing else.

Avoid business logic inside route handlers.

---

# Validation

Every request must be validated.

Use

Zod

Never trust frontend validation.

Validate

Request body

Query parameters

Route parameters

Headers when necessary

---

# State Management

Prefer Server Components.

Client state only when necessary.

Use

React state

Context API

Server Components

URL Search Params

Avoid global state unless required.

No Redux.

No MobX.

No Zustand unless absolutely necessary.

---

# Data Fetching

Use Server Components whenever possible.

Client fetching only for:

Search

Filters

Forms

Live updates

Notifications

Infinite scroll

Never fetch data twice unnecessarily.

---

# Forms

Use

React Hook Form

Zod

Server validation

Loading states

Error states

Success feedback

Auto-focus first invalid field.

Never submit invalid data.

---

# Environment Variables

Use

.env.local

Required

MONGODB_URI

JWT_SECRET

NEXT_PUBLIC_APP_URL

Never expose secrets to the client.

Never use NEXT_PUBLIC for sensitive values.

---

# Error Handling

Every API must return consistent responses.

Success

{
success: true,
data: {}
}

Failure

{
success: false,
message: "",
errors: []
}

Never expose stack traces.

Never expose database errors.

Log internally.

---

# Logging

Development

Console logging allowed.

Production

Structured logging.

Future

Sentry

LogRocket

Never log passwords.

Never log JWTs.

Never log sensitive user data.

---

# Image Strategy

Use next/image.

Lazy load images.

Responsive sizing.

Blur placeholders.

Optimize formats.

Never use raw img tags.

---

# Performance

Target Lighthouse Score

95+

Use

Code Splitting

Dynamic Imports

Image Optimization

Server Components

Caching

Lazy Loading

Streaming

Avoid unnecessary re-renders.

---

# Security

Passwords

bcrypt

JWT

httpOnly Cookies

CSRF Protection

Input Validation

Rate Limiting

XSS Protection

Mongo Injection Prevention

Sanitize user input.

Escape dangerous output.

---

# Accessibility

Every component must support

Keyboard navigation

ARIA labels

Screen readers

Visible focus

High contrast

Reduced motion

Touch-friendly controls

Minimum WCAG AA.

---

# SEO

Every page should include

Title

Description

Open Graph

Twitter Cards

Structured Data where appropriate

Canonical URLs

Sitemap

Robots

---

# Styling Rules

Tailwind only.

No CSS frameworks.

Avoid inline styles.

Create reusable utility classes when repeated.

Use CSS variables for theme colors.

---

# Naming Conventions

Components

PascalCase

Hooks

useSomething

Utilities

camelCase

Constants

UPPER_SNAKE_CASE

Files

kebab-case

Folders

kebab-case

Mongo Models

PascalCase

---

# Component Rules

Each component should have one responsibility.

Maximum

200 lines.

Extract reusable logic.

Avoid prop drilling.

Prefer composition over inheritance.

---

# Page Rules

Pages should only

Fetch data

Compose components

Handle metadata

Avoid large business logic.

Maximum

250 lines.

---

# Reusability Rules

Before creating a new component

Ask

Can an existing component be reused?

Never duplicate

Cards

Buttons

Forms

Dialogs

Tables

Inputs

Badges

---

# Code Quality

Follow

SOLID

DRY

KISS

Composition over inheritance

Single responsibility

Readable code over clever code

---

# Comments

Avoid unnecessary comments.

Write self-documenting code.

Only comment

Complex algorithms

Important business rules

Edge cases

---

# Git Workflow

Small commits.

Feature branches.

Meaningful commit messages.

Example

feat(auth): implement JWT login

fix(booking): prevent duplicate requests

refactor(search): extract filters

---

# Future Compatibility

The architecture should support

Native Mobile App

AI Assistant

Payments

Video Calls

Messaging

Communities

Events

Subscriptions

Analytics

Without requiring major rewrites.

---

# Final Engineering Rules

Never duplicate code.

Never hardcode business data.

Never bypass validation.

Never expose secrets.

Never mix UI and business logic.

Prefer reusable components.

Prefer server rendering.

Optimize before shipping.

Every file should be easy to understand by a new developer.

Code should feel like it was written by an experienced engineering team—not generated by AI.