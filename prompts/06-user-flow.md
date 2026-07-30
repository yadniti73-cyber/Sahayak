# Sahayak — User Flow

Version: 1.0

This document defines every major user journey inside Sahayak.

Every page, button, dialog, API, and state should support these flows.

Users should never feel lost.

Every interaction should naturally guide them toward the next meaningful action.

---

# Product Philosophy

Every flow should answer three questions.

1. Where am I?

2. What can I do?

3. What happens next?

If users cannot answer these within a few seconds, the flow needs improvement.

---

# Primary User Journeys

There are three primary journeys.

1. Visitor Journey

2. Seeker Journey

3. Mentor Journey

---

# Visitor Journey

Landing Page

↓

Learn what Sahayak is

↓

Browse Categories

↓

Browse Mentors

↓

View Mentor Profile

↓

Click "Request Guidance"

↓

Authentication Required

↓

Register / Login

↓

Return to Booking

↓

Complete Booking

↓

Dashboard

---

Goal

Convert anonymous visitors into registered users.

---

# Landing Page Flow

Visitor

↓

Hero Section

↓

Platform Overview

↓

Why Sahayak

↓

Browse Categories

↓

Featured Mentors

↓

How It Works

↓

Testimonials

↓

FAQ

↓

Call To Action

↓

Register

Every section should encourage users to continue exploring.

No dead ends.

---

# Registration Flow

Visitor

↓

Choose Role

↓

Seeker

or

Mentor

↓

Basic Information

↓

Email Verification (Future)

↓

Account Created

↓

Profile Completion

↓

Dashboard

---

Required Information

Common

Name

Email

Password

City

Phone

---

Mentor Only

Headline

Experience

Category

Languages

Biography

Session Modes

Pricing

Availability

---

After Registration

Seeker

↓

Dashboard

Mentor

↓

Complete Profile Wizard

---

# Login Flow

User

↓

Enter Credentials

↓

Validate

↓

Successful Login

↓

Redirect to Previous Page

or

Dashboard

If login originated from booking,

return the user directly to the booking page.

Never lose context.

---

# Mentor Discovery Flow

Home

↓

Search

or

Browse Categories

↓

Mentor List

↓

Apply Filters

↓

Sort Results

↓

Open Profile

↓

Book Session

---

Search Filters

Category

City

Language

Session Type

Price

Experience

Rating

Verified

Availability

---

No Results Flow

Display

Friendly illustration

Helpful message

Suggested categories

Clear filters button

Back to Home button

Never show an empty page.

---

# Mentor Profile Flow

User opens profile

↓

View Photo

↓

Headline

↓

Experience

↓

Languages

↓

Availability

↓

Ratings

↓

Session Modes

↓

Reviews

↓

Request Guidance

↓

Booking Flow

The primary action should always remain visible.

---

# Booking Flow

Mentor Profile

↓

Choose Session Mode

↓

Choose Date

↓

Choose Time

↓

Write Optional Note

↓

Review Booking

↓

Confirm

↓

Booking Created

↓

Booking Success Page

↓

Dashboard

---

Booking Status Flow

Requested

↓

Mentor Reviews Request

↓

Accepted

↓

Session Scheduled

↓

Completed

↓

Review

↓

Relationship Continues

Alternative

Requested

↓

Rejected

↓

Notify User

↓

Suggest Similar Mentors

---

# Seeker Dashboard Flow

Dashboard

↓

Upcoming Sessions

↓

Recent Activity

↓

Notifications

↓

Saved Mentors

↓

Booking History

↓

Profile

↓

Settings

Every page should expose the most important action first.

---

# Mentor Dashboard Flow

Dashboard

↓

Today's Schedule

↓

Pending Requests

↓

Upcoming Sessions

↓

Availability

↓

Analytics

↓

Profile

↓

Settings

↓

Verification Status

Mentors should immediately know

what requires attention.

---

# Profile Completion Flow

Incomplete Profile

↓

Profile Completion Banner

↓

Missing Information

↓

Complete Step

↓

Save

↓

Progress Updated

↓

100% Complete

Incomplete profiles should never block browsing,

but they should encourage completion.

---

# Notification Flow

Events

Booking Created

Booking Accepted

Booking Rejected

Booking Cancelled

Reminder

Profile Verified

System Announcement

Future

Messages

Payments

Reviews

Certificates

Notifications should never interrupt users unnecessarily.

---

# Session Completion Flow

Session Ends

↓

Mentor Marks Complete

↓

Seeker Confirms

↓

Review Enabled

↓

Rating Submitted

↓

Recommendation Engine Updated

---

# Review Flow

Completed Booking

↓

Rate Mentor

↓

Write Feedback

↓

Submit

↓

Public Review

Reviews cannot be edited after approval.

---

# Favorite Mentor Flow

Mentor Profile

↓

Save Mentor

↓

Added to Favorites

↓

Dashboard Favorites

↓

Quick Booking

---

# Search Recovery Flow

If search returns no results

Show

Suggested Mentors

Popular Categories

Remove Filters Button

Search Again

Never present a blank experience.

---

# Authentication Recovery Flow

Forgot Password

↓

Email

↓

Reset Link

↓

Create New Password

↓

Login

Future

OTP

Social Login

Passkeys

---

# Error Recovery Flow

If an API request fails

Show

Human-friendly explanation

Retry Button

Contact Support

Never expose raw errors.

---

# Empty States

Every empty page should contain

Friendly illustration

Clear explanation

Primary action

Examples

No Bookings

Browse Mentors

No Favorites

Explore Mentors

No Notifications

Everything is up to date

---

# Loading States

Never use blank screens.

Use

Skeleton loaders

Button loading

Image placeholders

Optimistic UI where appropriate

---

# Mobile Flow

Everything should be usable with one hand.

Primary actions

Bottom reachable.

Large touch targets.

Minimal typing.

Sticky CTA where appropriate.

---

# Accessibility Flow

Keyboard users

Can navigate every interactive element.

Screen readers

Have descriptive labels.

Reduced Motion

Disables decorative animations.

Forms

Clearly announce validation errors.

---

# Future Flows

Video Consultation

↓

Payment

↓

Meeting Reminder

↓

Video Session

↓

Recording

↓

Feedback

↓

Certificate

---

Community Flow

Join Community

↓

Ask Question

↓

Receive Answers

↓

Follow Mentor

↓

Attend Event

---

Corporate Mentorship

Company

↓

Invite Employees

↓

Assign Mentors

↓

Track Progress

↓

Analytics

---

# Global Navigation Rules

Users should never be more than

three clicks away

from their next meaningful action.

Back navigation should always preserve state.

Search filters should persist while browsing.

Forms should auto-save where possible.

Never discard user input without warning.

---

# Flow Design Principles

Every interaction should

Reduce uncertainty

Reduce effort

Increase trust

Increase clarity

Encourage progress

Support accessibility

Guide users naturally

If users stop and wonder

"What should I do next?"

the flow has failed.