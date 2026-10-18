# ShareServe — Good food. Useful things. Shared with care.

A modern, responsive social-impact web prototype connecting event organizers and individual donors with nearby verified NGOs to redistribute surplus food and donate reusable essential items (clothes, books, stationery, and household goods).

---

## 🌟 Visual Identity & Design System

- **Deep Forest Green** (`#245C46`): Trustworthy, grounded, compassionate anchor.
- **Soft Sage** (`#DCE9DE`): Gentle, restorative background and border tints.
- **Warm Cream** (`#FAF7F0`): Warm, human-centered surface background.
- **Peach Accent** (`#EFAF91`): Uplifting callouts and interactive highlights.
- **Charcoal Text** (`#26332D`): High-contrast, readable typography.
- **Typography**: Inter and Manrope for clean, accessible readability.

---

## 🚀 Key Features & Complete Lifecycle Flow

1. **Full Donor-to-NGO Lifecycle**:
   - **Step 1: Listing Creation (`/donate`)** — Donor specifies items, quantity, pickup address, availability window, and food safety data.
   - **Step 2: NGO Discovery & Claim (`/donations` & `/ngo-dashboard`)** — Suitable nearby NGO discovers the listing and claims it. Single-claim locking ensures no double acceptance.
   - **Step 3: Pickup Coordination** — Claiming NGO receives donor contact details and coordinates collection.
   - **Step 4: Status Workflow (`Accepted` → `Collected` → `Completed`)** — Progress updates synchronize across the public listings, donor dashboard, NGO dashboard, and admin console.

2. **Interactive Role Switcher**:
   - Easily toggle between **Donor** (*Priya Sharma*), **NGO Partner** (*Rajesh Verma - Robin Hood Food Rescue*), and **Platform Admin** (*Aisha Khan*) directly from the top navigation bar.

3. **Food Safety & Compliance Guard**:
   - Food listings enforce preparation timestamps, safe consumption deadlines, storage instructions, and allergen warnings.
   - Items with elapsed deadlines are prevented from acceptance to protect public health.

4. **LocalStorage Persistence & Demo Reset**:
   - All listings, status changes, and NGO verification actions persist in browser `localStorage`.
   - A **"Reset Demo Data"** button in the footer and admin dashboard restores fresh seed records at any time.

---

## 🧭 Pages & Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Hero section, illustrative metrics, categories, 3-step guide, featured donations, and NGO spotlight. |
| `/donate` | Create Donation | Dynamic donation form with food safety inputs, photo presets, validation, and immediate persistence. |
| `/donations` | Browse Donations | Search, category filter, locality filter, sorting, and full detail modal view. |
| `/ngos` | Discover NGOs | Verified NGO directory with accepted categories, service areas, and contact information. |
| `/dashboard` | Donor Dashboard | Personal donation tracker with KPI counters, status badges, and listing management. |
| `/ngo-dashboard` | NGO Dashboard | Available donations console, one-click claim lock, and progressive dispatch controls. |
| `/admin` | Admin Console | Verification approval/rejection queue, listing moderation, and category distribution statistics. |
| `/signin` | Sign In / Accounts | Multi-role authentication page with instant 1-click test personas for Donor, NGO, and Admin. |

---

## 🛠️ Technology Stack

- **React 18** + **TypeScript**
- **Vite 6**
- **Tailwind CSS 3**
- **Lucide React** (icons)
- **React Router 6**
- **HTML5 LocalStorage**

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Testing the Complete Donor-to-NGO Flow

1. **Browse Initial Seed Data**:
   - Open `/` and explore active listings and verified NGOs.
   - Go to `/donations` to filter by category or locality.
2. **Create a Donation as a Donor**:
   - Click **"Donate Something"** (`/donate`).
   - Select **Surplus Food** and fill in meal details, preparation time, and deadline.
   - Submit to publish the listing.
3. **Switch to NGO Persona**:
   - In the header, click the persona switcher and select **"NGO Partner (Rajesh Verma)"**.
   - Navigate to `/ngo-dashboard`.
   - Locate the newly published donation under **"Open Available Donations"**.
   - Click **"Claim for Pickup"**.
4. **Advance the Donation Lifecycle**:
   - Switch to the **"Active Pickups In Progress"** tab.
   - Notice the donor's exact street address and phone number are now revealed.
   - Click **"Confirm Volunteer Picked Up"** (`collected`).
   - Click **"Confirm Delivered & Distributed"** (`completed`).
5. **Verify Donor Dashboard Sync**:
   - Switch persona back to **"Donor"** and visit `/dashboard`.
   - See the status stepper reflect the completed journey!
6. **Simulate Admin Verification**:
   - Switch to **"Admin"** and visit `/admin`.
   - Review pending NGOs (e.g. *EcoShare Urban Foundation*) and click **Approve** or **Reject**.

---

## 🏗️ Architecture & Optional Modules

- **`src/hooks/useDonations.ts`**: Reusable custom hook for donation state logic, multi-criteria filtering (category, status, urgency, locality), sorting, and KPI metrics calculation.
- **`src/components/DonationMap.tsx`**: Interactive geographic discovery radar plotting donations across Bengaluru localities with category pins, urgency halo, and preview drawers.
- **`src/pages/SignIn.tsx`**: Multi-role authentication page supporting Donor, NGO Partner, and Admin logins with instant 1-click test credentials.
- **`supabase/schema.sql`**: Complete PostgreSQL schema featuring enums, RLS policies, table indexes, and single-claim locking logic for transitioning to a live database.
- **`tests/donations.test.ts`**: Automated test suite validating listing creation, claim locking, lifecycle progression, and food safety timers.
- **`.env.example`**: Template for environment variables (Supabase, Mapbox, and API endpoints).

---

## 📄 License & Disclaimer

Built for social impact evaluation. Sample NGOs and volunteer transactions are illustrative prototypes for demonstrating platform feasibility.
