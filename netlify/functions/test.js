// Simple test function to verify Netlify is working
// You can test this at: https://stupendous-creponne-f281c6.netlify.app/.netlify/functions/test

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: '✅ Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
    })
  };
};