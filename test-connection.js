// Test MongoDB Connection
// Run this locally to test if your connection string works

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://udaytyagi:uday2006@cluster0.4vyv1dd.mongodb.net/gemini-ds-copilot?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    try {
        console.log('🔗 Testing MongoDB connection...');
        
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        console.log('✅ Connected successfully to MongoDB!');
        
        // Test database access
        const db = client.db('gemini-ds-copilot');
        const collections = await db.listCollections().toArray();
        
        console.log('📊 Available collections:', collections.map(c => c.name));
        
        // Test inserting a sample record
        const testCollection = db.collection('connection_test');
        const result = await testCollection.insertOne({
            test: true,
            timestamp: new Date(),
            message: 'Connection test successful'
        });
        
        console.log('✅ Test document inserted with ID:', result.insertedId);
        
        // Clean up test document
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log('🧹 Test document cleaned up');
        
        await client.close();
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testConnection();