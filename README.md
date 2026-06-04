# Multi-Tenant School Management System

A responsive SaaS-style school management portal built with:
- Next.js (App Router)
- Node.js API routes
- MongoDB persistence
- Tailwind CSS styling

## Features
- Super admin dashboard for tenant approval, plan management, billing, and platform analytics
- School admin dashboard for academic setup, admissions, fees, and notices
- Teacher portal for attendance, gradebooks, and homework management
- Student portal for academic results, attendance history, and fee tracking
- Parent portal for child progress, attendance monitoring, and fee updates
- Tenant and school management with status control and tenant onboarding
- Responsive UI optimized for mobile, tablet, and desktop
- MongoDB-backed tenant lookup with fallback sample data

## Getting Started
1. Copy `.env.local.example` to `.env.local`
2. Set `MONGODB_URI` and `MONGODB_DB`
   - If using MongoDB Atlas, use a URI like:
     `mongodb+srv://<username>:<password>@cluster0.mongodb.net/zass-management?retryWrites=true&w=majority`
   - Make sure your Atlas cluster is running and your IP is allowed in the network access whitelist.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

### Troubleshooting Atlas DNS errors
- If you see `querySrv ECONNREFUSED`, it usually means DNS SRV lookup failed.
- Confirm the hostname in `MONGODB_URI` is correct.
- Confirm your network allows DNS resolution for Atlas.
- If you are behind a firewall, add your IP to Atlas access rules or use a local MongoDB URI.

## Project Structure
- `app/` - Next.js pages and routing
- `lib/` - MongoDB connection helper and tenant data logic
- `app/api/tenants` - API routes to fetch tenant information
- `app/[tenant]` - Tenant-specific dashboard and settings

## Notes
- If `MONGODB_URI` is not configured, the app will use built-in sample tenant data.
- Add tenant documents to the `tenants` collection in MongoDB to persist real school data.
