# TODO — Tenant Dashboard CRUD + MongoDB wiring

## Phase 1: Backend CRUD (MongoDB)
- [ ] Add CRUD functions to `lib/school.ts`:
  - [ ] students (create/update/delete)
  - [ ] teachers (create/update/delete)
  - [ ] billing (billing collection CRUD)
  - [ ] school admin / academic setup (academicSetup CRUD + admissions/notices CRUD if needed)
  - [ ] settings (tenant profile CRUD in `tenants` collection)
  - [ ] teacher portal (teacherPortal CRUD)
  - [ ] student portal (studentPortal CRUD)
  - [ ] parent portal (parentPortal CRUD)
- [ ] Add tenant-scoped API routes under `app/api/tenants/[tenant]/...`:
  - [ ] `students` (list/create + update/delete)
  - [ ] `teachers`
  - [ ] `billing`
  - [ ] `admin` (academic setup, admissions, notices)
  - [ ] `settings`
  - [ ] `teacher-portal`
  - [ ] `student-portal`
  - [ ] `parent-portal`

## Phase 2: Frontend CRUD UI
- [ ] Add reusable client components (forms/table/actions) under `components/tenant/*` (as needed)
- [ ] Update tenant pages to call the CRUD APIs and enable Create/Edit/Delete:
  - [ ] `app/[tenant]/admin/page.tsx`
  - [ ] `app/[tenant]/students/page.tsx`
  - [ ] `app/[tenant]/teachers/page.tsx`
  - [ ] `app/[tenant]/billing/page.tsx`
  - [ ] `app/[tenant]/teacher/page.tsx`
  - [ ] `app/[tenant]/student/page.tsx`
  - [ ] `app/[tenant]/parent/page.tsx`
  - [ ] `app/[tenant]/settings/page.tsx`
  - [ ] `app/[tenant]/page.tsx` (overview cards if needed)

## Phase 3: Auth/Authorization (follow-up hardening)
- [ ] Ensure tenant admin-only access for dashboard CRUD endpoints (role: `admin`)
- [ ] Ensure portal CRUD permissions match requirements

## Phase 4: Validation & Testing
- [ ] Verify tenant scoping works (records read/written only for matching tenant)
- [ ] Verify MongoDB persistence works when `MONGODB_URI` is configured
- [ ] Verify demo fallback doesn’t allow writes when Mongo isn’t configured
