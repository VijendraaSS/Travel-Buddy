cat > models/TravelBuddy.js <<'EOF'
const mongoose = require("mongoose");

const travelBuddySchema = new mongoose.Schema({
    buddyId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    tripDuration: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("TravelBuddy", travelBuddySchema);
EOF
