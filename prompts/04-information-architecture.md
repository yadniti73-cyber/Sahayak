
# Sahayak — Information Architecture

Version: 1.0

This document defines the complete application structure.

It serves as the blueprint for every screen, route, user flow, and module.

No page or feature should exist outside this architecture.

---

# Application Structure

The application consists of six primary modules.

1. Public Website

2. Authentication

3. Mentor Marketplace

4. Booking System

5. User Dashboard

6. Administration

Every feature belongs to one of these modules.

---

# User Roles

The platform has three user roles.

## Visitor

A visitor has not signed in.

Capabilities:

- Browse homepage
- View mentor categories
- Search mentors
- View mentor profiles
- Read FAQs
- Register
- Login

Restrictions:

Cannot

Book sessions

Message mentors

View dashboard

Save mentors

Leave reviews

---

## Seeker

A seeker is someone looking for guidance.

Capabilities:

- Browse mentors
- Search mentors
- Filter mentors
- View mentor profiles
- Request mentorship
- Book sessions
- Cancel requests
- Manage bookings
- Save favorite mentors
- Edit profile
- Receive notifications
- Leave ratings after completed sessions

---

## Mentor

Mentors provide guidance.

Capabilities:

- Create mentor profile
- Manage availability
- Accept bookings
- Reject bookings
- Complete sessions
- View earnings (future)
- Manage profile
- Respond to seekers
- View analytics
- Manage schedules

---

## Admin

Administrators manage the platform.

Capabilities:

Everything.

Including

Users

Mentors

Categories

Bookings

Verification

Reports

Analytics

CMS

Platform settings

---

# Route Structure

Public Routes

```
/
```

Landing Page

---

```
/about
```

About Sahayak

---

```
/how-it-works
```

Platform explanation

---

```
/mentors
```

Mentor discovery

---

```
/mentors/[slug]
```

Mentor profile

---

```
/categories
```

All mentorship categories

---

```
/category/[slug]
```

Category detail page

---

```
/faq
```

Frequently asked questions

---

```
/contact
```

Contact page

---

Authentication

```
/login
```

---

```
/register
```

---

```
/forgot-password
```

---

```
/reset-password
```

---

Authenticated Routes

```
/dashboard
```

Redirects according to role.

---

Seeker Dashboard

```
/dashboard/home
```

---

```
/dashboard/bookings
```

---

```
/dashboard/favorites
```

---

```
/dashboard/messages
```

Future

---

```
/dashboard/profile
```

---

```
/dashboard/settings
```

---

Mentor Dashboard

```
/mentor/dashboard
```

---

```
/mentor/bookings
```

---

```
/mentor/calendar
```

---

```
/mentor/availability
```

---

```
/mentor/profile
```

---

```
/mentor/analytics
```

---

```
/mentor/settings
```

---

Admin

```
/admin
```

---

```
/admin/users
```

---

```
/admin/mentors
```

---

```
/admin/categories
```

---

```
/admin/bookings
```

---

```
/admin/reports
```

---

```
/admin/settings
```

---

# Navigation Structure

Desktop Navigation

Logo

Home

Find Mentors

Categories

About

Contact

Search

Login

Register

User Menu

---

Mobile Navigation

Drawer

Large touch targets

Sticky bottom CTA

No tiny menu items

---

# Search Architecture

Global Search

Supports

Mentor name

Category

City

Language

Specialization

Experience

---

Filters

Category

Language

Session Mode

Availability

Price

Rating

Verified

Experience

City

---

Sorting

Recommended

Highest Rated

Most Experienced

Lowest Price

Highest Price

Recently Joined

Most Booked

Alphabetical

---

# Primary User Journey

Visitor

↓

Landing

↓

Categories

↓

Mentor Search

↓

Mentor Profile

↓

Register

↓

Book Session

↓

Dashboard

↓

Repeat Booking

---

Mentor Journey

Register

↓

Complete Profile

↓

Upload Verification

↓

Set Availability

↓

Receive Requests

↓

Conduct Sessions

↓

Build Reputation

---

# Feature Modules

Module

Landing

Contains

Hero

Categories

Testimonials

Mission

Vision

CTA

FAQ

Footer

---

Module

Mentor Discovery

Contains

Search

Filters

Cards

Pagination

Recommendations

---

Module

Mentor Profile

Contains

Bio

Experience

Reviews

Availability

Languages

Session Modes

Book Button

---

Module

Booking

Contains

Date Picker

Time Slots

Session Type

Notes

Confirmation

Booking Status

---

Module

Dashboard

Contains

Statistics

Upcoming Sessions

History

Notifications

Settings

---

Module

Administration

Contains

Users

Mentors

Verification

Categories

Bookings

Reports

Platform Settings

---

# Protected Routes

Require Authentication

Dashboard

Bookings

Profile

Settings

Availability

Messages

Admin

Mentor Dashboard

Booking Creation

Review Submission

---

# Route Protection

Visitor

↓

Login Required

↓

Return to original page

↓

Continue action

Example

Visitor clicks

Book Session

↓

Redirect Login

↓

Login Successful

↓

Automatically return to Booking page

---

# Global Layout

Navbar

↓

Page Content

↓

CTA Banner (optional)

↓

Footer

---

Dashboard Layout

Sidebar

+

Top Navigation

+

Content Area

+

Notification Drawer

---

# Future Modules

Video Sessions

Payments

Communities

Discussion Forums

AI Assistant

Voice Translation

Events

Learning Paths

Certificates

Organization Accounts

Corporate Mentorship

Government Programs

NGO Programs

Marketplace

Mentor Subscription

API Platform

Mobile Application

---

# Architecture Rules

Every feature must belong to exactly one module.

Every page must have:

Loading State

Empty State

Error State

Success State

Responsive Layout

Accessibility Support

SEO Metadata

Every page must expose one clear primary action.

No page should exist without a purpose.

Navigation should never exceed three levels of depth.

Every user should always know:

Where they are.

What they can do.

What happens next.