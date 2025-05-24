const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const { MongoClient, ServerApiVersion } = require('mongodb');



app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hi Node js active for this project")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rtm-aktu-csc-society.ewi1wmf.mongodb.net/?retryWrites=true&w=majority&appName=RTM-AKTU-CSC-SOCIETY`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const database = client.db("rtm-aktu-csc-society");
        const events = database.collection("events");
        const galleries = database.collection("galleries");
        const blogs = database.collection("blogs");
        const users = database.collection("users");


        app.get('/events', async (req, res) => {
            const query = events.find({});
            const cursor = await query.toArray();
            res.send(cursor);
            console.log("Event get successfully");
        })

        app.get('/galleries', async (req, res) => {
            const query = galleries.find({});
            const cursor = await query.toArray();
            res.send(cursor);
            console.log("Gallery item get successfully");
        })

        app.get('/blogs', async (req, res) => {
            const query = blogs.find({});
            const cursor = await query.toArray();
            res.send(cursor);
            console.log("blogs get successfully");
        })
        app.get('/users', async (req, res) => {
            const query = users.find({});
            const cursor = await query.toArray();
            res.send(cursor);
            console.log("blogs get successfully");
        })

        app.get("/user", async (req, res) => {
            const email = req.query.email;
            const user = await users.findOne({ email }); // Adjust as needed
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        });


        app.post('/event', async (req, res) => {
            const newEvent = req.body;
            const result = await events.insertOne(newEvent);
            console.log(result);
            res.json(result);
        });

        app.post('/gallery', async (req, res) => {
            const newGallery = req.body;
            const result = await galleries.insertOne(newGallery);
            console.log(result);
            res.json(result);
        });

        app.post('/blog', async (req, res) => {
            const newBlog = req.body;
            const result = await blogs.insertOne(newBlog);
            console.log(result);
            res.json(result);
        });

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await users.insertOne(newUser);
            console.log(result);
            res.json(result);
        });



        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const updateDoc = {
                $set: {
                    status: "Approved",
                },
            };

            const result = await blogs.updateOne(query, updateDoc);
            console.log("Blog approved:", result);
            res.json(result);
        });



        app.put('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const { title, imageURL, content, tag, updatedAt } = req.body;

            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title,
                    imageURL,
                    content,
                    tag,
                    updatedAt: updatedAt || new Date().toISOString(), // fallback if not sent
                },
            };

            try {
                const result = await blogs.updateOne(query, updateDoc);
                console.log("Blog Edited Successfully", result);
                res.json(result);
            } catch (error) {
                console.error("Update Error:", error);
                res.status(500).json({ message: "Failed to update blog." });
            }
        });


        app.put('/event/:id', async (req, res) => {
            const id = req.params.id;
            const {
                eventName,
                eventImageUrl,
                eventDate,
                eventDescription,
                eventDay,
                location,
                time,
                presentedTime,
                updatedAt,
            } = req.body;

            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    eventName,
                    eventImageUrl,
                    eventDate,
                    eventDescription,
                    eventDay,
                    location,
                    time,
                    presentedTime,
                    updatedAt: updatedAt || new Date().toISOString(), // fallback if not sent
                },
            };

            try {
                const result = await events.updateOne(query, updateDoc); // ensure `events` is your MongoDB collection
                console.log("Event updated successfully:", result);
                res.json(result);
            } catch (error) {
                console.error("Update Error:", error);
                res.status(500).json({ message: "Failed to update event." });
            }
        });





        app.put("/galleries/:id", async (req, res) => {
            const id = req.params.id;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID format" });
            }

            const {
                title,
                description,
                imageUrl,
                category,
                updatedAt,
            } = req.body;

            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title,
                    description,
                    imageUrl,
                    category,
                    updatedAt: updatedAt || new Date().toISOString(),
                },
            };

            try {
                const result = await galleries.updateOne(query, updateDoc);
                console.log("Gallery updated successfully:", result);
                res.json(result);
            } catch (error) {
                console.error("Update Error:", error);
                res.status(500).json({ message: "Failed to update gallery item." });
            }
        });

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });





        app.delete('/blog/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Deleting Blog ID:", id);
            try {
                const query = { _id: new ObjectId(id) };
                const result = await blogs.deleteOne(query);
                res.json(result);
                console.log('Blog Deleted Successfully', result);
            } catch (error) {
                console.error('Error deleting blog:', error);
                res.status(500).json({ error: 'Failed to delete blog' });
            }
        });

        app.delete('/event/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Deleting Blog ID:", id);
            try {
                const query = { _id: new ObjectId(id) };
                const result = await events.deleteOne(query);
                res.json(result);
                console.log('Event Deleted Successfully', result);
            } catch (error) {
                console.error('Error deleting event:', error);
                res.status(500).json({ error: 'Failed to delete event' });
            }
        });



        app.delete('/galleries/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Deleting Gallery ID:", id);
            try {
                const query = { _id: new ObjectId(id) };
                const result = await galleries.deleteOne(query);
                res.json(result);
                console.log('Gallery Item Deleted Successfully', result);
            } catch (error) {
                console.error('Error deleting gallery item:', error);
                res.status(500).json({ error: 'Failed to delete gallery item' });
            }
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Node Listening From port:", port)
});

// this is the end