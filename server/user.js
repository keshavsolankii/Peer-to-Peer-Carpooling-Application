import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    metaid: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    pastRides: {
        type: Array,
        default: [],
    },
    offeredRides: {
        type: Array,
        default: []
    }
});

const User = mongoose.model('User', UserSchema);
export default User;