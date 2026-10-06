import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Por favor ingrese un correo electrónico"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Por favor ingrese un correo electrónico válido"]
    },
    password: {
        type: String,
        required: [true, "Por favor ingrese una contraseña"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        select: false
    },
    name: {
        type: String,
        required: [true, "Por favor ingrese un nombre"],
        trim: true
    },
}, { timestamps: true });

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
