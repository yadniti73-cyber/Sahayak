# Sahayak — Database Design

Version: 1.0

This document defines the complete MongoDB database architecture.

The schema should be scalable, normalized where appropriate, and designed for future expansion.

Database Technology

MongoDB Atlas

ODM

Mongoose

---

# Database Principles

Every collection must have:

_id

createdAt

updatedAt

Proper indexes

Validation

References

Soft delete support where applicable

---

# Collections

The platform consists of the following collections.

Users

MentorProfiles

Categories

Bookings

Reviews

Notifications

Favorites

Availability

Sessions (Future)

Payments (Future)

Messages (Future)

Communities (Future)

Events (Future)

---

# Users Collection

Purpose

Stores all platform users.

Fields

_id

name

email

passwordHash

phone

avatar

role

status

city

state

country

timezone

preferredLanguage

bio

emailVerified

phoneVerified

lastLogin

isActive

createdAt

updatedAt

---

Role Enum

SEEKER

MENTOR

ADMIN

---

Status Enum

ACTIVE

INACTIVE

SUSPENDED

BLOCKED

---

Indexes

email

role

status

city

---

# MentorProfiles Collection

Purpose

Stores mentor-specific information.

Fields

userId

headline

about

category

experienceYears

languages

education

certifications

specializations

pricing

currency

sessionModes

availabilityEnabled

responseTime

averageRating

reviewCount

completedSessions

verificationStatus

featured

profileCompletion

socialLinks

website

createdAt

updatedAt

---

Verification Status

PENDING

UNDER_REVIEW

VERIFIED

REJECTED

---

Indexes

userId

category

averageRating

experienceYears

featured

verificationStatus

---

# Categories Collection

Purpose

Mentorship categories.

Fields

name

slug

icon

description

parentCategory

displayOrder

active

createdAt

updatedAt

---

Example

Medical

Career

Education

Finance

Legal

Agriculture

Technology

Business

Arts

Parenting

Sports

Research

---

# Bookings Collection

Purpose

Stores mentorship bookings.

Fields

seekerId

mentorId

sessionMode

scheduledDate

scheduledTime

duration

status

notes

mentorNotes

meetingLink

meetingLocation

cancellationReason

completedAt

createdAt

updatedAt

---

Booking Status

REQUESTED

ACCEPTED

REJECTED

RESCHEDULED

CANCELLED

COMPLETED

NO_SHOW

---

Indexes

mentorId

seekerId

status

scheduledDate

---

# Reviews Collection

Fields

bookingId

mentorId

seekerId

rating

title

review

visible

createdAt

updatedAt

One review per completed booking.

---

# Favorites Collection

Fields

userId

mentorId

createdAt

Composite Index

userId + mentorId

---

# Notifications Collection

Fields

userId

title

message

type

read

actionUrl

createdAt

---

Types

BOOKING

SYSTEM

REVIEW

PROFILE

PAYMENT

MESSAGE

---

# Availability Collection

Purpose

Mentor schedule.

Fields

mentorId

dayOfWeek

startTime

endTime

timezone

active

createdAt

updatedAt

---

# Relationships

User

↓

MentorProfile

1:1

---

User

↓

Bookings

1:N

---

Mentor

↓

Bookings

1:N

---

Mentor

↓

Reviews

1:N

---

Category

↓

Mentors

1:N

---

# Future Collections

Payments

Transactions

Invoices

Refunds

Subscriptions

Messages

Conversations

Video Sessions

AI Conversations

Communities

Events

Certificates

Learning Paths

---

# Soft Delete

Collections should support

deletedAt

deletedBy

where appropriate.

Never permanently delete production data.

---

# MongoDB Index Strategy

Unique

email

slug

Composite

mentorId + date

userId + mentorId

status + scheduledDate

Text Index

mentor name

headline

bio

specializations

---

# Design Rules

Never embed large documents.

Prefer references.

Avoid deeply nested objects.

Keep documents under MongoDB limits.

Prepare for millions of records.

---

# Migration Strategy

Future schema changes should be backward compatible.

Never require destructive migrations.

---

# Final Principle

The database should support ten times the expected scale without major redesign.