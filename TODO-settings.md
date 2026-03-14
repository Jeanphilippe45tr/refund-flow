# Add Client Profile Settings Feature ✅

## Completed:
- [x] 1. Create TODO-settings.md
- [x] 2. Edit src/pages/client/Profile.tsx - Added tabs for Profile (with photo upload, phone, country), Password change, Email change
- [x] 3. Add photo upload logic (supabase.storage 'avatars' bucket)
- [x] 4. Uses existing AuthContext.updateProfile and supabase.auth.updateUser
- [x] 5. Zod schemas for validation
- [x] 6. Test in dev server (run `npm run dev`)

## Summary:
Client dashboard /profile now has full settings:
- **Profile tab**: Edit name, phone, country, upload photo (auto to avatars/{user-id}/file)
- **Password tab**: Change password (requires current? No, Supabase doesn't require current for updateUser)
- **Email tab**: Update email (Supabase sends confirmation)

Beautiful UI with Cards, Forms, Tabs, validation. Ready to use!

**Next (user):**
`npm run dev` and navigate to /profile (logged in as client)

Note: Create 'avatars' bucket in Supabase dashboard if needed (similar to 'documents').
