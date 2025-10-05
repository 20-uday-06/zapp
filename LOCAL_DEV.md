# Local Development Setup (Optional)

If you want to test the website locally before deploying:

## Prerequisites:
- Node.js installed on your computer
- Git (already have this)

## Setup:
1. Open terminal in your website folder
2. Run: `npm install`
3. Create `.env` file (not tracked by git):
   ```
   MONGODB_URI=mongodb+srv://udaytyagi:YOUR_PASSWORD@cluster0.4vyv1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Run: `npm run dev`
5. Open: http://localhost:8888

## Testing Forms Locally:
- Fill out waitlist forms
- Check MongoDB Atlas to see data
- Forms should work exactly like production

## When Ready:
- Push changes to GitHub
- Netlify will auto-deploy

This is completely optional - you can deploy directly to Netlify without local testing.