"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI;
async function seed() {
    if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
        console.error('❌ Error: Please provide a valid MONGODB_URI in your .env file first!');
        process.exit(1);
    }
    const client = new mongodb_1.MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        const db = client.db();
        const usersColl = db.collection('users');
        const email = 'alex@example.com';
        const existingUser = await usersColl.findOne({ email });
        let userId;
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const result = await usersColl.insertOne({
                name: 'Alex Fitness',
                email,
                password: hashedPassword,
                height: 180,
                weight: 85,
                age: 28,
                gender: 'male',
                activityLevel: 'moderately_active',
                goal: 'lose_weight',
                macroGoals: {
                    dailyCalories: 2200,
                    proteinGrams: 180,
                    carbsGrams: 200,
                    fatGrams: 75
                },
                createdAt: new Date(),
                updatedAt: new Date()
            });
            userId = result.insertedId;
            console.log('👤 Created user: alex@example.com');
        }
        else {
            userId = existingUser._id;
            console.log('👤 User already exists, skipping creation.');
        }
        await db.collection('weightlogs').deleteMany({ userId });
        await db.collection('foodentries').deleteMany({ userId });
        const weightLogs = [];
        const foodEntries = [];
        const now = new Date();
        console.log('⏳ Generating 30 days of history...');
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const baseWeight = 85 - (30 - i) * 0.13;
            const noise = (Math.random() - 0.5) * 0.4;
            weightLogs.push({
                userId,
                weight: parseFloat((baseWeight + noise).toFixed(1)),
                date: new Date(date),
                notes: i === 0 ? 'Current weight' : '',
                createdAt: new Date(date),
                updatedAt: new Date(date)
            });
            const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
            const foodNames = {
                breakfast: ['Oatmeal & Protein', 'Eggs & Avocado Toast', 'Greek Yogurt Bowl'],
                lunch: ['Chicken Quinoa Salad', 'Turkey Wrap', 'Tuna Poke Bowl'],
                dinner: ['Steak & Asparagus', 'Salmon & Broccoli', 'Pasta with Lean Beef'],
                snack: ['Protein Shake', 'Almonds', 'Apple & Peanut Butter']
            };
            for (const mealType of meals) {
                if (Math.random() > 0.2) {
                    const names = foodNames[mealType];
                    foodEntries.push({
                        userId,
                        foodName: names[Math.floor(Math.random() * names.length)],
                        mealType,
                        calories: 400 + Math.floor(Math.random() * 300),
                        protein: 20 + Math.floor(Math.random() * 20),
                        carbs: 20 + Math.floor(Math.random() * 30),
                        fat: 5 + Math.floor(Math.random() * 15),
                        servingSize: 1,
                        date: new Date(date),
                        createdAt: new Date(date),
                        updatedAt: new Date(date)
                    });
                }
            }
        }
        await db.collection('weightlogs').insertMany(weightLogs);
        console.log(`⚖️  Inserted ${weightLogs.length} weight logs`);
        await db.collection('foodentries').insertMany(foodEntries);
        console.log(`🍎 Inserted ${foodEntries.length} food entries`);
        console.log('\n✨ Database seeded successfully!');
        console.log('👉 You can now log in with:');
        console.log('   Email: alex@example.com');
        console.log('   Password: password123');
    }
    catch (err) {
        console.error('❌ Seeding failed:', err);
    }
    finally {
        await client.close();
    }
}
seed();
//# sourceMappingURL=seed.js.map