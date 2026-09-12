const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in backend/.env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected successfully.');

        const adminEmail = 'admin@brixxspace.com';
        const adminPassword = 'admin123';

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            user.fullName = 'Super Admin';
            user.role = 'admin';
            user.password = adminPassword; // Will be hashed by pre('save')
            await user.save();
            console.log(`✓ Super Admin password and role updated successfully:`);
            console.log(`  Email:    ${user.email}`);
            console.log(`  Password: ${adminPassword}`);
            console.log(`  Role:     ${user.role}`);
        } else {
            user = await User.create({
                fullName: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '+91 9876543210',
                company: 'BrixxSpace'
            });
            console.log(`✓ Super Admin created successfully:`);
            console.log(`  Email:    ${user.email}`);
            console.log(`  Password: ${adminPassword}`);
            console.log(`  Role:     ${user.role}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(`Error seeding super admin: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
