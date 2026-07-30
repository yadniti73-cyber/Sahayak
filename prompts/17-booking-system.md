# Sahayak — Booking System Specification

Version: 1.0

The Booking System is the core interaction between seekers and mentors.

It must be simple, transparent, reliable, and secure.

---

# Booking Lifecycle

REQUESTED

↓

PENDING_CONFIRMATION

↓

CONFIRMED

↓

REMINDER_SENT

↓

SESSION_IN_PROGRESS

↓

COMPLETED

↓

REVIEW_PENDING

↓

CLOSED

Alternative Flows

REQUESTED

↓

REJECTED

or

REQUESTED

↓

CANCELLED

or

CONFIRMED

↓

RESCHEDULE_REQUESTED

↓

CONFIRMED

---

# Session Modes

Video Call

In-Person

Meeting

Seminar

Future

Voice Call

Group Session

Workshop

Webinar

---

# Booking Information

Every booking contains

Booking ID

Mentor

Seeker

Category

Session Mode

Date

Time

Duration

Timezone

Location

Meeting Link

Notes

Status

Created Date

Updated Date

---

# Booking Creation Flow

Mentor Profile

↓

Choose Session Type

↓

Choose Date

↓

Choose Time Slot

↓

Optional Notes

↓

Review Details

↓

Confirm Booking

↓

Success Screen

↓

Dashboard

---

# Time Slot Rules

Only available slots may be booked.

No overlapping sessions.

Timezone aware.

Future recurring schedules supported.

---

# Duration Options

30 Minutes

45 Minutes

60 Minutes

90 Minutes

120 Minutes

Custom (Future)

---

# Booking Confirmation

Mentor receives notification.

Mentor may

Accept

Reject

Request Reschedule

Response deadline configurable.

---

# Cancellation Policy

Only before session starts.

Mentor cancellation requires reason.

Seeker cancellation optional reason.

Future

Cancellation fees.

---

# Rescheduling

Allowed by both users.

Creates notification.

Old slot released.

New slot validated.

History preserved.

---

# Booking Timeline

Created

Accepted

Reminder Sent

Started

Completed

Reviewed

Every event stored chronologically.

---

# Booking Status Colors

Requested

Yellow

Confirmed

Green

Cancelled

Gray

Rejected

Red

Completed

Blue

---

# Notifications

Booking Created

Booking Accepted

Booking Rejected

Booking Cancelled

Reminder

Session Starting

Session Completed

Review Request

---

# Dashboard Integration

Upcoming Sessions

Past Sessions

Pending Requests

Cancelled Sessions

Completed Sessions

---

# Validation

Booking cannot exist without

Valid Mentor

Valid Seeker

Available Time

Valid Session Mode

Authenticated User

---

# Future Integrations

Payments

Video Meetings

Calendar Sync

Google Calendar

Outlook

Zoom

Google Meet

Microsoft Teams

---

# Business Rules

Mentors cannot accept overlapping sessions.

Seekers cannot book suspended mentors.

Blocked users cannot create bookings.

Completed bookings become read-only.

---

# Analytics

Track

Total Bookings

Completion Rate

Cancellation Rate

Average Response Time

Most Popular Categories

Most Popular Session Mode

---

# Success Definition

A booking should take less than two minutes to complete while giving both users complete confidence in the process.