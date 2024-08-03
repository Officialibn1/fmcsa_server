const express = require('express');
const dotenv = require('dotenv');
const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());


// ALTqPXy0MJHgyAjj

// mongodb+srv://officialibn:<password>@cluster0.cfwpwry.mongodb.net/

const uri = process.env.MONGODB_CONNECTION_URI

const client = new MongoClient(uri);

async function connectToMongo() {
    await client.connect();
    console.log("Connected to MongoDB");
}

connectToMongo().catch(console.error);

// FUNCTION USED TO INSERT ALL DATA IN THE EXCEL SHEET INTO THE MONGODB COLLECTION
// async function importExcelToMongoDB() {
//     const workbook = xlsx.readFile('src/FMSCA_records.xlsx');
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const jsonData = xlsx.utils.sheet_to_json(worksheet);

//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         const database = client.db("FMCSA_DB");
//         const collection = database.collection("FMCSA_DB_COMPANIES");

//         const result = await collection.insertMany(jsonData);
//         console.log(`${result.insertedCount} documents were inserted`);
//     } finally {
//         await client.close();
//     }
// }

// importExcelToMongoDB().catch(console.error);


app.get('/api/companies', async (req, res) => {
    const { page = 1, pageSize = 40 } = req.query;
    const skip = (page - 1) * pageSize;

    try {
        const database = client.db("FMCSA_DB");
        const collection = database.collection("FMCSA_DB_COMPANIES");

        const data = await collection.find()
            .skip(Number(skip))
            .limit(Number(pageSize))
            .toArray();

        const totalCount = await collection.countDocuments();

        res.json({ data, totalCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));