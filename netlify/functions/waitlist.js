// Netlify Function to handle waitlist submissions
// This file should be placed in netlify/functions/waitlist.js

const { MongoClient } = require('mongodb');

// MongoDB connection string - you'll get this from MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI; // We'll set this as environment variable

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.email || !data.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Select database and collection
    const db = client.db('zapp');
    const collection = data.type === 'business' ? 
      db.collection('business_waitlist') : 
      db.collection('user_waitlist');

    // Prepare document to insert
    const document = {
      ...data,
      timestamp: new Date(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      userAgent: event.headers['user-agent']
    };

    // Insert into database
    const result = await collection.insertOne(document);
    
    // Close connection
    await client.close();

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        id: result.insertedId,
        message: 'Successfully joined the waitlist!' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to save to waitlist' 
      })
    };
  }
};