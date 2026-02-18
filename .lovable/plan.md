
# MVP Priority Plan: Create Activity + Join + Lean Signup

## Current State Assessment

The core building blocks already exist:
- Activities table in Supabase with RLS policies
- `useActivities` hook fetches public activities
- `useActivityParticipants` hook handles join/leave
- `CreateActivityModal` UI exists but is wired to `createEvent` (calendar events flow), not directly to the `activities` table
- Auth is in place (email/password via Supabase)
- The `Activities` component shows the feed and join/leave buttons

## What is Broken / Missing for MVP

### Problem 1 - Create Activity does NOT save to the `activities` table correctly
The "Create" button in `Activities.tsx` opens nothing (it has no onClick handler). The modal in `Home.tsx` calls `createEvent` from `useCalendarEventsDB`, which saves to `activities` with `is_public` defaulting to `false` and `status` not set to `'active'`, so newly created activities never appear in the public feed.

### Problem 2 - The "Create" button in Activities.tsx is disconnected
The button renders but has no `onClick` handler wired to any modal.

### Problem 3 - Lean Signup needs improvement
Currently signup requires: name + email + password. For lean MVP, we want just email + password to get people in fast. Name can be skipped (defaults to username from email).

### Problem 4 - No public shareable link / no way for guests to see activities before signing up
Someone who receives an invite link is immediately blocked by `ProtectedRoute` and sent to `/auth`. They cannot see what activity they are joining before creating an account. This creates friction.

## The Plan

### Step 1 - Fix `CreateActivityModal` to save directly to the `activities` table as public + active
Update the `handleCreateEventModal` flow in `App.tsx` and the handler in `Activities.tsx` to call a new direct-insert mutation (or extend `useCalendarEventsDB.createEvent`) that sets:
- `is_public: true`
- `status: 'active'`
- `is_group_activity: true`

This ensures created activities appear in the public feed immediately.

### Step 2 - Wire the "Create" button in `Activities.tsx` to open the modal
Add local state `isCreateModalOpen` to `Activities.tsx` and wire the two "Create Activity" / "Create" buttons to open `CreateActivityModal`. On submit, save directly to `activities` table with the correct fields.

### Step 3 - Simplify the Auth page for lean signup
- Remove the `name` field from the signup form (it gets auto-populated from the email prefix via the `handle_new_user` database trigger already in place)
- Change the headline to match the app's purpose
- Make the flow: email → password → in (2 fields, 1 button)

### Step 4 - Create a public activities browse page (no login required)
Add a `/browse` route that is NOT wrapped in `ProtectedRoute`. It shows the public activities feed with a "Join" button. Clicking "Join" redirects to `/auth?redirect=/browse` so the user can sign up and is then redirected back. This removes the biggest friction point: people can see what they are joining before committing to an account.

### Step 5 - Post-signup redirect back to intended action
After successful signup/login on `/auth`, check for a `?redirect=` query param and navigate there instead of always going to `/`.

## Technical Implementation Details

### Files to change

1. **`src/hooks/useCalendarEventsDB.ts`** - Add `is_public: true` and `status: 'active'` to the insert in `createEvent`, so activities created via the modal appear in the feed

2. **`src/components/Activities.tsx`** - Add `isCreateModalOpen` state, wire both Create buttons to `CreateActivityModal`, add the `onCreateActivity` handler that saves to DB

3. **`src/pages/AuthPage.tsx`** - Remove the `name` field from signup, read `?redirect` param and navigate there after login/signup

4. **`App.tsx`** - Add `/browse` route (unprotected) pointing to a new `BrowseActivitiesPage`

5. **`src/pages/BrowseActivitiesPage.tsx`** *(new file)* - Public-facing page using `useActivities` hook. Shows activity cards with a "Join" CTA that redirects to auth. No login required to view.

## User Flow After Changes

```text
Guest receives link or visits app
        |
        v
/browse  (public, no login needed)
        |
  Sees activity list
        |
  Clicks "Join"
        |
        v
/auth?redirect=/browse
        |
  Signs up (email + password only)
        |
  Redirected back to /browse
        |
  Clicks "Join" again → joins activity ✓
```

```text
Logged-in user
        |
        v
Activities tab
        |
  Clicks "Create"
        |
        v
CreateActivityModal
        |
  Fills title, sport, date, time, location
        |
  Submits → saved to activities table
  (is_public=true, status=active)
        |
  Appears in feed immediately ✓
```

## Scope Kept Minimal
- No profile photo required
- No onboarding steps before joining
- No email verification blocking the join flow (Supabase can be configured to skip this, or we note it)
- Name is auto-generated from email, editable later
