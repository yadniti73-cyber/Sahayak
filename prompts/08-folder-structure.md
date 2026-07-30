# Sahayak — System Architecture

Version: 1.0

This document defines the architectural principles for the entire application.

Every feature, module, API, component, and database interaction must follow these rules.

This architecture prioritizes scalability, maintainability, and clean separation of concerns.

---

# Architectural Philosophy

The project should follow:

Feature-Based Architecture

NOT

Page-Based Architecture

Every feature owns:

• UI

• Business Logic

• Validation

• API Integration

• Hooks

• Services

This minimizes coupling and improves scalability.

---

# Layered Architecture

The application follows five logical layers.

Presentation

↓

Application

↓

Domain

↓

Repository

↓

Database

Each layer has one responsibility.

---

# Presentation Layer

Contains

Pages

Layouts

Components

Forms

Dialogs

Tables

Cards

Navigation

Responsibilities

Display UI.

Collect user input.

Render server data.

Never contain business logic.

---

# Application Layer

Contains

Services

Use Cases

Workflow Logic

Responsibilities

Business rules.

Application workflows.

Validation orchestration.

Authorization.

Repositories are called only from this layer.

---

# Domain Layer

Contains

Business models

Constants

Enums

Rules

Business policies

Independent from framework.

---

# Repository Layer

Contains

MongoDB queries.

Aggregation pipelines.

CRUD operations.

No business logic.

Repositories should never call other repositories.

---

# Database Layer

MongoDB

Mongoose

Indexes

Collections

Validation

Transactions

---

# Dependency Direction

Presentation

↓

Service

↓

Repository

↓

Database

Never reverse dependencies.

Repositories never import UI.

Components never import repositories.

---

# Feature Ownership

Each feature owns

components/

hooks/

services/

validators/

constants/

helpers/

Feature logic should never leak into other modules.

---

# Communication Between Features

Allowed

Shared UI

Shared Utilities

Shared Services

Forbidden

Direct component imports across unrelated features.

Circular dependencies.

---

# Shared Layer

Contains

Button

Card

Modal

Input

Avatar

Badge

Toast

Skeleton

Navbar

Footer

Utilities

Constants

Hooks

Shared components must remain generic.

---

# Authentication Boundary

Authentication must be completely isolated.

Auth module should provide

Current User

Role

Permissions

Session

Logout

Other modules consume authentication.

They never implement authentication themselves.

---

# Data Flow

Browser

↓

Page

↓

Server Component

↓

Service

↓

Repository

↓

MongoDB

↓

Repository

↓

Service

↓

Page

↓

UI

Data always flows in one direction.

---

# Error Flow

Database Error

↓

Repository

↓

Service

↓

API

↓

User Friendly Message

Never expose internal implementation details.

---

# Validation Flow

Client Validation

↓

Server Validation

↓

Database Validation

Never rely on frontend validation.

---

# Authorization Flow

User Request

↓

Middleware

↓

JWT Verification

↓

Role Verification

↓

Business Permission

↓

Controller

↓

Service

↓

Repository

Every protected request follows this chain.

---

# File Ownership

One file

One responsibility.

Avoid utility files with hundreds of unrelated functions.

---

# Import Rules

Allowed

shared → features

lib → features

models → repositories

repositories → services

Forbidden

features importing app

repositories importing UI

services importing React components

---

# API Architecture

Every endpoint should follow

Request

↓

Validation

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database

↓

Response

---

# Scalability Rules

Every module should be removable without affecting unrelated modules.

Future features

Messaging

Payments

Video Calls

Communities

AI Assistant

should plug into existing architecture.

---

# Final Principle

Architecture should make future development easier.

Never optimize for writing less code today.

Optimize for maintaining the codebase for years.