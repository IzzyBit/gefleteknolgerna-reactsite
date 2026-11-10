# Gefleteknologerna – React/Vite recreation

A responsive React recreation of [gefleteknologerna.se](https://gefleteknologerna.se/), now including a **Trossen pub calendar** with opening hours, work shifts and volunteer interest registrations.

## Start locally

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). For a production build run `npm run build`, then `npm run preview`.

## New: Trossen / Pubkalender (`/trossen`)

- Month-by-month calendar (Swedish week starts Monday), next opening dates and details for each date.
- Click **Administrera kalendern** to add, edit or delete an opening date; set the **pub's opening hours**, a separate **work shift**, the **number of helpers** needed, and optional notes.
- Visitors can select an upcoming date and register their interest with **name**, **preferred contact method** (Messenger, Instagram, WhatsApp, e-mail or other) and **contact details**.
- **Consent is required** before submitting; the form explains the use of contact details and links to the association's contact e-mail.
- In *shared mode*, admins can read and delete submitted contact information, but ordinary visitors cannot see it.

### Option A: Quick local demo (default)

This works **immediately**, without accounts or external services. Dates created under Administration are stored in the **current browser's localStorage**. They are **not shared with other users or devices**; Administration has **no password** in demo mode. Signups open a pre-filled `mailto:` message to `info@gefleteknologerna.se`. The visitor must click **Send** in their own e-mail client. No signup contact details are saved in the demo. This is useful for testing the design, **not for publishing real opening hours to everyone**.

### Option B: Shared calendar (recommended for a real website)

1. Create a project at [Supabase](https://supabase.com/).
2. Run **`supabase/schema.sql`** in its SQL Editor. This creates the calendar and volunteer tables plus **Row Level Security** policies.
3. In **Authentication → Users**, create an administrator account, or invite the person who will administer the pub.
4. Find that account's **UUID**. In Supabase SQL Editor, grant calendar admin access:

   ```sql
   insert into public.pub_admins (user_id)
   values ('REPLACE_WITH_ADMIN_AUTH_USER_UUID');
   ```

5. Copy `.env.example` to `.env.local`. Fill in your project's URL and **publishable** key from **Project Settings → API**:

   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
   ```

6. Restart Vite (`npm run dev`) or rebuild the deployed project. The page now loads dates from Supabase for **everyone**. Under **Administrera kalendern**, admins log in with their Supabase Auth e-mail/password. Only registered admins can modify dates or read private signups.

**Security and data protection:** `VITE_` values are public frontend configuration, not secret credentials. Never use a Supabase `service_role` or secret key here. The supplied RLS policies restrict sensitive read access; the frontend never exposes volunteer details to the public. For a real public site, add anti-spam protections/rate limits, establish and document a retention/deletion routine, publish the association's full privacy notice, and verify the legal basis for processing volunteer contact details. Admins can delete individual signups via the interface; automatic retention cleanup is **not** configured.

**Email:** In local/demo mode, signups create a pre-addressed email in the user's mail app. In shared mode, signups are securely saved and visible to an admin, **but no automatic e-mail is sent**. Automatic email notifications require configuring a server-side email provider or a Supabase Edge Function and should never put mail-service secrets in the React frontend.

## Other pages

Home, Inspark (+ phadder FAQ), Evenemang, Styrelsen (2023/2024), Futurum, Nyheter, Kontakt, Historia, Stadgar, Föreskrifter and Husregler.

## Notes

- This is a design and content recreation, not a copy of the original site's source code. Some long texts are summarized and some assets remain linked to `usercontent.one`, requiring internet access. Confirm rights before publicly launching a website with this branding.
- The main contact form opens an e-mail client; no contact backend is configured for that page.
- Historical board and event details are from the original public site and may not be current.
- For hosting in a nested path (such as GitHub Pages), set Vite's `base` and configure routing/fallbacks for `BrowserRouter`.
