import mongoose from 'mongoose';

const OfferRideSchema = new mongoose.Schema({
    metaid: {
        type: String,
        required: true,
        unique: true,
    },
    driver: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    dest: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    contact: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    carName: {
        type: String,
        required: true
    },
    carNumber: {
        type: String,
        required: true,
        unique: true,
    },
    offers: {
        type: Array,
        default: []
    }
}
);
const OfferedRide = mongoose.model('OfferedRide', OfferRideSchema);

export default OfferedRide;