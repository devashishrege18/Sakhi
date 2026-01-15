const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- In-Memory State (Socket only & Support) ---
// connectedUsers: { [guest_id]: { name, socketId, room } }
let connectedUsers = {};
const MAX_USERS = 10;
const GLOBAL_ROOM = "GLOBAL_FAN_ROOM";

// --- Mongoose Models ---
const CommentSchema = new mongoose.Schema({
    author_id: String,
    author_name: String,
    text: String,
    created_at: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    author_id: String,
    author_name: String,
    content: String,
    fandomId: { type: String, default: 'GLOBAL_FAN_ROOM' },
    likes: [String], // Array of guest_ids
    comments: [CommentSchema],
    created_at: { type: Date, default: Date.now } // Auto-managed date
});

const Post = mongoose.model('Post', PostSchema);

// --- MongoDB Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/fandom_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Connected to MongoDB');

        // Seed Initial Data if Empty (Only after connection)
        Post.countDocuments()
            .then(count => {
                if (count === 0) {
                    new Post({
                        author_id: 'system',
                        author_name: 'FandomHost',
                        content: 'Welcome to the newly persisted Fandom! 🏟️ Your posts are now saved in MongoDB.',
                        fandomId: GLOBAL_ROOM
                    }).save().then(() => console.log('seeded initial post'));
                }
            })
            .catch(err => console.error("Seeding Error:", err));
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- REST API ---

// GET /posts - Get feed (from DB)
app.get('/posts', async (req, res) => {
    try {
        const { fandomId } = req.query;
        let query = {};
        if (fandomId) {
            query.fandomId = fandomId;
        }

        // Sort by newest first
        const posts = await Post.find(query).sort({ created_at: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// POST /posts - Create post (Save to DB)
app.post('/posts', async (req, res) => {
    try {
        const { guest_id, guest_name, content, fandomId } = req.body;

        if (!guest_id || !guest_name || !content) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const newPost = new Post({
            author_id: guest_id,
            author_name: guest_name,
            content,
            fandomId: fandomId || GLOBAL_ROOM
        });

        await newPost.save();

        // Return updated feed for that fandom to keep frontend sync consistent
        const posts = await Post.find({ fandomId: newPost.fandomId }).sort({ created_at: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to create post" });
    }
});

// POST /posts/:id/like - Like/Unlike
app.post('/posts/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        const { guest_id } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(guest_id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1); // Unlike
        } else {
            post.likes.push(guest_id); // Like
        }

        await post.save();

        res.json({ id: post._id, likes: post.likes.length, likedByMe: likeIndex === -1 });
    } catch (err) {
        res.status(500).json({ error: "Failed to toggle like" });
    }
});

// POST /posts/:id/comments - Add comment (Save to DB)
app.post('/posts/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { guest_id, guest_name, text } = req.body;

        if (!guest_id || !guest_name || !text) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        post.comments.push({
            author_id: guest_id,
            author_name: guest_name,
            text,
            created_at: new Date()
        });

        await post.save();

        const newComment = post.comments[post.comments.length - 1];
        res.json({ success: true, comment: newComment, totalComments: post.comments.length });
    } catch (err) {
        res.status(500).json({ error: "Failed to add comment" });
    }
});

// --- NEW API: Support (Ported from app/api/support/route.js) ---
app.post('/api/support', async (req, res) => {
    try {
        const { athleteId } = req.body;
        // In a real app, this would integrate with a payment gateway or DB.
        // For now, we simulate a successful transaction.
        console.log(`[Support API] Received support for: ${athleteId} `);

        // Emulate some verification/processing delay
        await new Promise(r => setTimeout(r, 500));

        res.status(200).json({ message: "Thank you for supporting rising talent!" });
    } catch (error) {
        console.error("Support API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// --- Socket.IO Logic (Real-time Chat & Presence) ---

io.use((socket, next) => {
    const currentCount = Object.keys(connectedUsers).length;
    if (currentCount >= MAX_USERS) {
        const err = new Error("Room full (Max 10 users)");
        return next(err);
    }
    next();
});

io.on('connection', (socket) => {

    const { guest_id, guest_name, roomId } = socket.handshake.query;

    if (!guest_id || !guest_name) {
        socket.disconnect(true);
        return;
    }

    const activeRoom = roomId || GLOBAL_ROOM;
    connectedUsers[guest_id] = { name: guest_name, socketId: socket.id, room: activeRoom };
    socket.join(activeRoom);

    // Initial Broadcasts
    io.to(activeRoom).emit('user_joined', { guest_id, guest_name });
    const roomUsers = Object.values(connectedUsers).filter(u => u.room === activeRoom);
    io.to(activeRoom).emit('update_users', roomUsers);

    console.log(`User ${guest_name} connected to ${activeRoom} (DB Connected)`);

    // Handle switching rooms
    socket.on('join_room', (data) => {
        const { roomId: newRoom } = data;
        const currentData = connectedUsers[guest_id];
        if (!currentData) return; // safety check
        const oldRoom = currentData.room;

        if (!newRoom || newRoom === oldRoom) return;

        socket.leave(oldRoom);
        socket.join(newRoom);

        // Update state
        connectedUsers[guest_id].room = newRoom;

        // Notify old room
        io.to(oldRoom).emit('user_left', { guest_id, guest_name });
        io.to(oldRoom).emit('update_users', Object.values(connectedUsers).filter(u => u.room === oldRoom));

        // Notify new room
        io.to(newRoom).emit('user_joined', { guest_id, guest_name });
        io.to(newRoom).emit('update_users', Object.values(connectedUsers).filter(u => u.room === newRoom));

        console.log(`${guest_name} switched from ${oldRoom} to ${newRoom} `);
    });

    socket.on('send_message', (data) => {
        const userData = connectedUsers[guest_id];
        const userRoom = userData ? userData.room : GLOBAL_ROOM;

        io.to(userRoom).emit('receive_message', {
            guest_id: data.guest_id,
            guest_name: data.guest_name,
            text: data.text,
            timestamp: new Date().toISOString()
        });
        // Note: Chat messages are still transient (Socket only) for now unless requested to persist.
    });

    socket.on('disconnect', () => {
        const userData = connectedUsers[guest_id];
        if (userData) {
            console.log(`User disconnected: ${userData.name} `);
            const userRoom = userData.room;
            delete connectedUsers[guest_id];

            if (userRoom) {
                io.to(userRoom).emit('user_left', { guest_id: userData.name }); // fixed payload structure
                io.to(userRoom).emit('update_users', Object.values(connectedUsers).filter(u => u.room === userRoom));
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT} `);
    console.log(`Real - time + MongoDB Fandom ready.`);
});
