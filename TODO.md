# Security Fix: Protect Dashboard Route TODO

## Steps:

- [x] 1. Understand files and create plan (completed)
- [x] 2. Create `frontend/src/components/ProtectedRoute.jsx`
- [x] 3. Update `frontend/src/App.jsx` to use ProtectedRoute for owner routes (/dashboard, /add-dish, /edit-dish/:id, /orders, /order-history)
- [x] 4. Add backup auth guard to `frontend/src/pages/Dashboard.jsx`
- [x] 5. Update other protected pages if needed (Orders.jsx, etc.)
- [x] 6. Test: logout → /dashboard redirects to login; login works
- [x] 7. Mark complete

**Current progress**: ProtectedRoute created and App.jsx routes protected.
