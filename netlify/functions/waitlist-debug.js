// Debug version of waitlist function with enhanced logging
// This helps troubleshoot any issues

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  console.log('🚀 Waitlist function called');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Environment check - MongoDB URI exists:', !!MONGODB_URI);
  
  // Add CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('📝 Parsing request body...');
    const data = JSON.parse(event.body);
    console.log('✅ Data received:', { ...data, email: data.email ? '***@***.com' : 'missing' });
    
    // Validate required fields
    if (!data.email || !data.name) {
      console.log('❌ Validation failed - missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    if (!MONGODB_URI) {
      console.log('❌ MongoDB URI not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database configuration missing' })
      };
    }

    console.log('🔗 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    // Select database and collection
    const db = client.db('gemini-ds-copilot');
    const collectionName = data.type === 'business' ? 'business_waitlist' : 'user_waitlist';
    const collection = db.collection(collectionName);
    
    console.log('📊 Using collection:', collectionName);

    // Prepare document to insert
    const document = {
      ...data,
      timestamp: new Date(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      userAgent: event.headers['user-agent'] || 'unknown'
    };

    console.log('💾 Inserting document...');
    const result = await collection.insertOne(document);
    console.log('✅ Document inserted with ID:', result.insertedId);
    
    // Close connection
    await client.close();
    console.log('🔒 Database connection closed');

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        id: result.insertedId,
        message: 'Successfully joined the waitlist!',
        collection: collectionName
      })
    };

  } catch (error) {
    console.error('❌ Error in waitlist function:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to save to waitlist',
        details: error.message
      })
    };
  }
};