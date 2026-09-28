/**
 * Seed script — creates sample users, a group, expenses and settlements.
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const env = require('../config/env');
const { calculateBalances, calculateSettlements } = require('../utils/settlementAlgorithm');

const seedUsers = [
  { name: 'Manish', email: 'manish@test.com', password: 'password123' },
  { name: 'Furqan', email: 'furqan@test.com', password: 'password123' },
  { name: 'Aisha', email: 'aisha@test.com', password: 'password123' },
  { name: 'Rahul', email: 'rahul@test.com', password: 'password123' }
];

const seedExpenses = [
  { description: 'Lunch at cafe', amount: 500, category: 'food' },
  { description: 'Dinner at restaurant', amount: 1500, category: 'food' },
  { description: 'Cab to the airport', amount: 800, category: 'travel' },
  { description: 'Movie night', amount: 1200, category: 'entertainment' },
  { description: 'Groceries', amount: 900, category: 'shopping' }
];

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected, cleaning existing data...');

    await Promise.all([
      User.deleteMany({}),
      Group.deleteMany({}),
      Expense.deleteMany({}),
      Settlement.deleteMany({})
    ]);

    console.log('Creating users...');
    const users = [];
    for (const u of seedUsers) {
      const user = await User.create({
        ...u,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`
      });
      users.push(user);
    }

    console.log('Creating group...');
    const group = await Group.create({
      name: 'Weekend Trip',
      description: 'Goa trip expenses',
      members: users.map((u) => u._id),
      createdBy: users[0]._id
    });

    await User.updateMany(
      { _id: { $in: users.map((u) => u._id) } },
      { $addToSet: { groups: group._id } }
    );
    
    console.log('Creating expenses...');
    for (let i = 0; i < seedExpenses.length; i++) {
      const e = seedExpenses[i];
      const paidBy = users[i % users.length];
      const splitAmong = users.map((u) => u._id);
      await Expense.create({
        ...e,
        paidBy: paidBy._id,
        group: group._id,
        splitAmong,
        date: new Date(Date.now() - (seedExpenses.length - i) * 86400000)
      });
    }

    const expenses = await Expense.find({ group: group._id });
    const balances = calculateBalances(expenses, users);
    const plans = calculateSettlements(balances);

    console.log('Creating settlements...');
    await Settlement.insertMany(
      plans.map((p) => ({
        group: group._id,
        from: p.from,
        to: p.to,
        amount: p.amount
      }))
    );

    console.log('Seed complete!');
    console.log('Users:');
    users.forEach((u) =>
      console.log(`  - ${u.email} (password: password123)`)
    );
    console.log(`Group: ${group.name}`);
    console.log('Balances:');
    users.forEach((u) => {
      console.log(`  - ${u.name}: ${balances[String(u._id)] || 0}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();