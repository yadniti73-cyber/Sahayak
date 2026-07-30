# Sahayak — Authentication & Authorization

Version: 1.0

Authentication must be secure, scalable, and framework-independent.

Never trust client-side data.

---

# Authentication Method

JWT

Stored in

httpOnly Cookie

Secure

SameSite=Lax

Production

Secure=true

Development

Secure=false

---

Password Hashing

bcryptjs

Salt Rounds

12

Never store plain text passwords.

Never log passwords.

---

Authentication Flow

Register

↓

Hash Password

↓

Save User

↓

Generate JWT

↓

Set Cookie

↓

Return User

---

Login Flow

Email

↓

Find User

↓

Compare Password

↓

Generate JWT

↓

Set Cookie

↓

Redirect

---

Logout

Clear Cookie

Destroy Session

Redirect Home

---

Current User

Every request should resolve

Current User

using

JWT

Never rely on userId from client requests.

---

JWT Payload

userId

role

email

issuedAt

expiresAt

Keep payload minimal.

---

Middleware

Protected Routes

↓

Read Cookie

↓

Verify JWT

↓

Load User

↓

Continue

or

Redirect

---

Role-Based Access Control

Visitor

Public Pages

Seeker

Booking

Favorites

Profile

Mentor Search

Mentor

Availability

Bookings

Profile

Analytics

Admin

Everything

---

Permission Rules

Users cannot edit another user.

Mentors cannot modify unrelated bookings.

Admins bypass standard restrictions.

Every API verifies ownership.

---

Protected Routes

Dashboard

Bookings

Favorites

Settings

Mentor Dashboard

Admin

Profile Editing

Review Submission

Availability

---

Public Routes

Landing

Login

Register

FAQ

Categories

Mentor Search

Mentor Profiles

---

Authorization Pattern

Middleware

↓

JWT

↓

Role

↓

Ownership

↓

Business Logic

---

Password Rules

Minimum

8 Characters

Must contain

Uppercase

Lowercase

Number

Special Character

Reject weak passwords.

---

Session Expiration

Access Token

7 Days

Future

Refresh Token

30 Days

Remember Me

Optional

---

Forgot Password

User enters email

↓

Token Generated

↓

Email Sent

↓

Token Verified

↓

Reset Password

↓

Invalidate Old Sessions

---

Email Verification

Future

Register

↓

Verification Email

↓

Token

↓

Verify

↓

Activate Account

---

Phone Verification

Future

OTP

SMS

Verification

---

Account Lockout

After

5 failed login attempts

↓

Temporary Lock

↓

Cooldown

Prevent brute force attacks.

---

Security Headers

Content Security Policy

X-Frame-Options

X-Content-Type-Options

Referrer Policy

Permissions Policy

---

Rate Limiting

Login

Register

Forgot Password

OTP

Public APIs

Prevent abuse.

---

Cookie Settings

httpOnly

true

secure

production only

sameSite

lax

path

/

---

CSRF Protection

All state-changing requests must verify origin.

Future

CSRF Tokens

---

Input Sanitization

Escape HTML

Prevent XSS

Prevent Mongo Injection

Trim whitespace

Normalize email addresses

---

Authentication Helpers

Create

verifyToken()

generateToken()

hashPassword()

comparePassword()

getCurrentUser()

requireAuth()

requireRole()

These should be reusable.

---

Audit Logging

Record

Login

Logout

Password Reset

Failed Login

Account Lock

Role Changes

Admin Actions

Never log passwords or JWTs.

---

Future Authentication

Google OAuth

GitHub OAuth

Microsoft OAuth

Passkeys

Biometrics

Two-Factor Authentication

Magic Links

---

Final Principle

Authentication should be invisible to users,

but uncompromising in security.

Every protected request must verify

Identity

↓

Permission

↓

Ownership

before executing any business logic.