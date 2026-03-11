# API Contract — Login Endpoint (US-7)

## Overview

This document defines the HTTP API contract that the `LoginScreen` component
will call when integrated with a real authentication backend.
Currently the component ships with a 1-second **mock** (no actual HTTP call)
so the UI can be exercised end-to-end without a server.

---

## Endpoint

```
POST /api/auth/login
```

### Headers

| Header         | Value              | Required |
|----------------|--------------------|----------|
| Content-Type   | application/json   | Yes      |
| Accept         | application/json   | Yes      |

---

## Request Body

```json
{
  "username": "string",   // required, non-empty
  "password": "string"    // required, non-empty
}
```

### Field Rules

| Field    | Type   | Min length | Max length | Notes                         |
|----------|--------|------------|------------|-------------------------------|
| username | string | 1          | 150        | Trimmed before sending        |
| password | string | 1          | 128        | Never logged or stored locally |

---

## Responses

### 200 OK — Authentication succeeded

```json
{
  "token": "string",          // JWT or opaque bearer token
  "expiresAt": "ISO-8601",    // e.g. "2026-03-11T15:00:00Z"
  "user": {
    "id": "string | number",
    "username": "string",
    "displayName": "string"   // optional
  }
}
```

### 400 Bad Request — Validation error (missing / empty fields)

```json
{
  "error": "VALIDATION_ERROR",
  "message": "username and password are required"
}
```

### 401 Unauthorized — Invalid credentials

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Username or password is incorrect"
}
```

### 429 Too Many Requests — Rate limit exceeded

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many login attempts. Please try again later.",
  "retryAfter": 60   // seconds
}
```

### 500 Internal Server Error — Unexpected server error

```json
{
  "error": "INTERNAL_ERROR",
  "message": "An unexpected error occurred. Please try again."
}
```

---

## Component Integration (Future)

When a real backend is available, replace the mock inside `LoginScreen.jsx`
by passing an `onSubmit` prop:

```jsx
// App.jsx (future integration example)
import LoginScreen from './components/LoginScreen';

async function authenticate({ username, password }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Erro ao autenticar. Tente novamente.');
  }

  const data = await response.json();
  // Store data.token securely (e.g., httpOnly cookie managed by server,
  // or sessionStorage for SPAs — never localStorage for sensitive tokens).
  return data;
}

function App() {
  return (
    <LoginScreen
      onSubmit={authenticate}
      onSuccess={() => console.info('Authenticated!')}
      onError={(msg) => console.error('Auth error:', msg)}
    />
  );
}
```

---

## Security Notes

- Passwords are **never** logged to the browser console.
- The password `<input>` uses `type="password"` (browser-level masking).
- HTTPS must be enforced on the server for all `/api/auth/*` routes.
- Rate-limiting and brute-force protection are backend responsibilities
  (out of scope for this component).

---

**Issue:** #7
**Date:** 2026-03-11
**Version:** 1.0
