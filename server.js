const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Member = require("./models/Member");
const TravelBuddy = require("./models/TravelBuddy");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// ============================================================
// MONGODB CONNECTION
// ============================================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });


// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ============================================================
//                 CAMPUS CLUB MEMBERS
// ============================================================


// ------------------------------------------------------------
// 1-4. Add 4 members
// ------------------------------------------------------------

app.post("/members/seed", async (req, res) => {

    try {

        await Member.deleteMany({});

        const members = [

            {
                memberId: "M001",
                name: "Arun Kumar",
                clubName: "Coding Club",
                yearOfStudy: 2,
                role: "Member",
                points: 120,
                interests: ["JavaScript", "Web Development"],
                status: "Active"
            },

            {
                memberId: "M002",
                name: "Priya Sharma",
                clubName: "Photography Club",
                yearOfStudy: 3,
                role: "Coordinator",
                points: 180,
                interests: ["Photography", "Travel"],
                status: "Active"
            },

            {
                memberId: "M003",
                name: "Rahul Raj",
                clubName: "Coding Club",
                yearOfStudy: 4,
                role: "President",
                points: 250,
                interests: ["Python", "Artificial Intelligence"],
                status: "Active"
            },

            {
                memberId: "M004",
                name: "Divya S",
                clubName: "Music Club",
                yearOfStudy: 1,
                role: "Member",
                points: 90,
                interests: ["Singing", "Guitar"],
                status: "Active"
            }

        ];

        const result = await Member.insertMany(members);

        res.json({
            message: "4 members added successfully",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 5. Members of particular club with points > specified value
// ------------------------------------------------------------

app.get("/members/filter", async (req, res) => {

    try {

        const { clubName, points } = req.query;

        const members = await Member.find({
            clubName: clubName,
            points: {
                $gt: Number(points)
            }
        });

        res.json(members);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 6 & 7. Search member by Member ID
// Display only Name, Club Name, Role, Points
// ------------------------------------------------------------

app.get("/members/search/:memberId", async (req, res) => {

    try {

        const member = await Member.findOne({
            memberId: req.params.memberId
        });

        if (!member) {

            return res.status(404).json({
                message: "Member not found"
            });

        }

        res.json({
            name: member.name,
            clubName: member.clubName,
            role: member.role,
            points: member.points
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 8. Update role and points
// ------------------------------------------------------------

app.put("/members/:memberId", async (req, res) => {

    try {

        const { role, points } = req.body;

        const member = await Member.findOneAndUpdate(

            {
                memberId: req.params.memberId
            },

            {
                role: role,
                points: Number(points)
            },

            {
                new: true
            }

        );

        if (!member) {

            return res.status(404).json({
                message: "Member not found"
            });

        }

        res.json({
            message: "Member updated successfully",
            data: member
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 9. Increase points of all members of a particular club
// ------------------------------------------------------------

app.patch("/members/club/increase-points", async (req, res) => {

    try {

        const { clubName, amount } = req.body;

        const result = await Member.updateMany(

            {
                clubName: clubName
            },

            {
                $inc: {
                    points: Number(amount)
                }
            }

        );

        res.json({
            message: "Points increased successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 10. Members whose points are within specified range
// ------------------------------------------------------------

app.get("/members/range", async (req, res) => {

    try {

        const { min, max } = req.query;

        const members = await Member.find({

            points: {
                $gte: Number(min),
                $lte: Number(max)
            }

        });

        res.json(members);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 11. Delete member using Member ID
// ------------------------------------------------------------

app.delete("/members/:memberId", async (req, res) => {

    try {

        const member = await Member.findOneAndDelete({

            memberId: req.params.memberId

        });

        if (!member) {

            return res.status(404).json({
                message: "Member not found"
            });

        }

        res.json({
            message: "Member deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 12. Display all remaining members descending by points
// ------------------------------------------------------------

app.get("/members", async (req, res) => {

    try {

        const members = await Member
            .find()
            .sort({
                points: -1
            });

        res.json(members);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
//                 TRAVEL BUDDY FINDER
// ============================================================


// ------------------------------------------------------------
// 1-4. Add 4 travel buddies
// ------------------------------------------------------------

app.post("/buddies/seed", async (req, res) => {

    try {

        await TravelBuddy.deleteMany({});

        const buddies = [

            {
                buddyId: "B001",
                name: "Karthik",
                destination: "Goa",
                age: 21,
                budget: 15000,
                tripDuration: 4,
                interests: ["Beach", "Photography"],
                status: "Active"
            },

            {
                buddyId: "B002",
                name: "Ananya",
                destination: "Manali",
                age: 22,
                budget: 25000,
                tripDuration: 6,
                interests: ["Hiking", "Adventure"],
                status: "Active"
            },

            {
                buddyId: "B003",
                name: "Vignesh",
                destination: "Goa",
                age: 23,
                budget: 18000,
                tripDuration: 5,
                interests: ["Music", "Beach"],
                status: "Active"
            },

            {
                buddyId: "B004",
                name: "Sneha",
                destination: "Ooty",
                age: 20,
                budget: 10000,
                tripDuration: 3,
                interests: ["Nature", "Photography"],
                status: "Active"
            }

        ];

        const result = await TravelBuddy.insertMany(buddies);

        res.json({
            message: "4 travel buddies added successfully",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 5. Destination + budget greater than specified amount
// ------------------------------------------------------------

app.get("/buddies/filter", async (req, res) => {

    try {

        const { destination, budget } = req.query;

        const buddies = await TravelBuddy.find({

            destination: destination,

            budget: {
                $gt: Number(budget)
            }

        });

        res.json(buddies);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 6 & 7. Search Buddy ID
// Display Name, Destination, Budget, Trip Duration
// ------------------------------------------------------------

app.get("/buddies/search/:buddyId", async (req, res) => {

    try {

        const buddy = await TravelBuddy.findOne({

            buddyId: req.params.buddyId

        });

        if (!buddy) {

            return res.status(404).json({
                message: "Travel buddy not found"
            });

        }

        res.json({

            name: buddy.name,

            destination: buddy.destination,

            budget: buddy.budget,

            tripDuration: buddy.tripDuration

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 8. Update destination and budget
// ------------------------------------------------------------

app.put("/buddies/:buddyId", async (req, res) => {

    try {

        const { destination, budget } = req.body;

        const buddy = await TravelBuddy.findOneAndUpdate(

            {
                buddyId: req.params.buddyId
            },

            {
                destination: destination,
                budget: Number(budget)
            },

            {
                new: true
            }

        );

        if (!buddy) {

            return res.status(404).json({
                message: "Travel buddy not found"
            });

        }

        res.json({

            message: "Travel buddy updated successfully",

            data: buddy

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 9. Increase budget of all people travelling to destination
// ------------------------------------------------------------

app.patch("/buddies/destination/increase-budget", async (req, res) => {

    try {

        const { destination, amount } = req.body;

        const result = await TravelBuddy.updateMany(

            {
                destination: destination
            },

            {
                $inc: {
                    budget: Number(amount)
                }
            }

        );

        res.json({

            message: "Budget increased successfully",

            modifiedCount: result.modifiedCount

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 10. Budget range
// ------------------------------------------------------------

app.get("/buddies/range", async (req, res) => {

    try {

        const { min, max } = req.query;

        const buddies = await TravelBuddy.find({

            budget: {
                $gte: Number(min),
                $lte: Number(max)
            }

        });

        res.json(buddies);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 11. Delete using Buddy ID
// ------------------------------------------------------------

app.delete("/buddies/:buddyId", async (req, res) => {

    try {

        const buddy = await TravelBuddy.findOneAndDelete({

            buddyId: req.params.buddyId

        });

        if (!buddy) {

            return res.status(404).json({
                message: "Travel buddy not found"
            });

        }

        res.json({

            message: "Travel buddy deleted successfully"

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ------------------------------------------------------------
// 12. Display all remaining buddies descending by budget
// ------------------------------------------------------------

app.get("/buddies", async (req, res) => {

    try {

        const buddies = await TravelBuddy
            .find()
            .sort({
                budget: -1
            });

        res.json(buddies);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on port ${PORT}`);

});
