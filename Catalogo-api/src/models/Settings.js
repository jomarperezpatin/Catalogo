import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    value: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Helper statics to get/set settings easily
settingsSchema.statics.getValue = async function (key, defaultValue = '') {
    const doc = await this.findOne({ key });
    return doc ? doc.value : defaultValue;
};

settingsSchema.statics.setValue = async function (key, value) {
    return this.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
    );
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
