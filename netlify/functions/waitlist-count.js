// Netlify Function to get waitlist counts
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('Getting waitlist counts...');
    
    // Check if MONGODB_URI is set
    if (!MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ error: 'Database configuration error' })
      };
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB for count query');

    // Select database
    const db = client.db('gemini-ds-copilot');
    
    // Get counts from both collections
    const userWaitlistCount = await db.collection('user_waitlist').countDocuments();
    const businessWaitlistCount = await db.collection('business_waitlist').countDocuments();
    
    console.log('Counts retrieved:', { users: userWaitlistCount, businesses: businessWaitlistCount });
    
    // Close connection
    await client.close();

    // Return counts
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        data: {
          totalUsers: userWaitlistCount,
          totalBusinesses: businessWaitlistCount,
          totalWaitlist: userWaitlistCount + businessWaitlistCount
        }
      })
    };

  } catch (error) {
    console.error('Error getting waitlist counts:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Failed to get waitlist counts',
        message: error.message
      })
    };
  }
};