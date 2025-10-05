# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create account with email/password
4. Choose "FREE" tier (M0 Sandbox)

## Step 2: Create a Cluster

1. Choose "AWS" as cloud provider
2. Select a region close to you (e.g., us-east-1)
3. Keep cluster name as "Cluster0" or change it
4. Click "Create Cluster" (takes 1-3 minutes)

## Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `zapp-user` (or any name)
5. Password: Generate secure password (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Set Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   `mongodb+srv://zapp-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Replace <password> with your actual password

Example:
`mongodb+srv://zapp-user:mySecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Next Steps:
- Save this connection string securely
- We'll use this to connect our backend to store waitlist data