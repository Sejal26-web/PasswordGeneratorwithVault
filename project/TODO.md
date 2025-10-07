# Fix Vault Items Not Being Added

## Problem
The deployed Vercel app is not adding items to the vault because the code was using a mock database that writes to JSON files, which doesn't work on Vercel's serverless environment (read-only file system).

## Solution
Switched the database code to use real MongoDB.

## Steps to Complete
1. **Set up MongoDB Database** (if not already done):
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a free cluster
   - Get the connection string (MONGODB_URI)

2. **Add Environment Variable in Vercel**:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Optionally add `MONGODB_DB` (default: 'password-manager')

3. **Redeploy the App**:
   - Commit and push the changes to trigger a new deployment
   - Or redeploy manually from Vercel dashboard

## Changes Made
- Updated `lib/mongodb.ts` to use real MongoDB instead of mock JSON file storage
- The app now requires `MONGODB_URI` environment variable

## Testing
After redeployment, try adding an item to the vault. It should now persist in the database.
