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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('Function started, MONGODB_URI exists:', !!MONGODB_URI);
    console.log('Request body:', event.body);
    
    // Parse the form data
    const data = JSON.parse(event.body);
    console.log('Parsed data:', data);
    
    // Validate required fields
    if (!data.email || !data.name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    // Check if MONGODB_URI is set
    if (!MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Database configuration error' })
      };
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Select database and collection
    const db = client.db('gemini-ds-copilot');
    const collectionName = data.type === 'business' ? 'business_waitlist' : 'user_waitlist';
    const collection = db.collection(collectionName);
    
    console.log('Using database: gemini-ds-copilot');
    console.log('Using collection:', collectionName);

    // Prepare document to insert
    const document = {
      ...data,
      timestamp: new Date(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      userAgent: event.headers['user-agent']
    };
    
    console.log('Document to insert:', document);

    // Insert into database
    console.log('Inserting document...');
    const result = await collection.insertOne(document);
    console.log('Insert result:', result);
    
    // Close connection
    await client.close();
    console.log('MongoDB connection closed');

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
    console.error('Error in waitlist function:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to save to waitlist',
        details: error.message
      })
    };
  }
};