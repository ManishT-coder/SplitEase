/* Temporary end-to-end smoke test using an in-memory MongoDB instance. */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'smoke-test-secret';
process.env.JWT_EXPIRE = '7d';
process.env.PORT = '0'; // avoid clashing with a running dev server

const { MongoMemoryServer } = require('mongodb-memory-server');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let mongod;
  try {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri('splitease_test');

    const request = require('supertest');
    const app = require('../server');
    const mongoose = require('mongoose');

    await sleep(2500); // wait for Mongo + app.listen
    await mongoose.connect(process.env.MONGODB_URI);

    const base = '/api';

    // 1. Register
    const reg = await request(app)
      .post(`${base}/auth/register`)
      .send({ name: 'Manish', email: 'manish@test.com', password: 'password123' })
      .expect(201);
    const token = reg.body.token;
    const manishId = reg.body.user._id;
    console.log('✓ Register OK');

    // 2. Register two more + duplicate rejected
    const furqan = await request(app)
      .post(`${base}/auth/register`)
      .send({ name: 'Furqan', email: 'furqan@test.com', password: 'password123' })
      .expect(201);
    const aisha = await request(app)
      .post(`${base}/auth/register`)
      .send({ name: 'Aisha', email: 'aisha@test.com', password: 'password123' })
      .expect(201);
    await request(app)
      .post(`${base}/auth/register`)
      .send({ name: 'Duplicate', email: 'manish@test.com', password: 'password123' })
      .expect(400);
    console.log('✓ Duplicate registration rejected');

    // 3. Login
    await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'manish@test.com', password: 'password123' })
      .expect(200);
    console.log('✓ Login OK');

    // 4. Wrong password -> 401
    await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'manish@test.com', password: 'wrongpass' })
      .expect(401);
    console.log('✓ Invalid login rejected');

    const auth = { Authorization: `Bearer ${token}` };

    // 5. Create group by member emails
    const groupRes = await request(app)
      .post(`${base}/groups`)
      .set(auth)
      .send({
        name: 'Weekend Trip',
        description: 'Goa trip',
        members: ['furqan@test.com', 'aisha@test.com']
      })
      .expect(201);
    const groupId = groupRes.body.group._id;
    console.log('✓ Group created');

    // 6. Get groups includes group
    const groups = await request(app).get(`${base}/groups`).set(auth).expect(200);
    if (groups.body.count !== 1) throw new Error('Expected 1 group');
    console.log('✓ Get groups OK');

    // 7. Add expense split among all three
    const splitAmong = [manishId, furqan.body.user._id, aisha.body.user._id];
    const expRes = await request(app)
      .post(`${base}/expenses`)
      .set(auth)
      .send({
        description: 'Dinner at restaurant',
        amount: 1500,
        groupId,
        paidBy: manishId,
        splitAmong,
        category: 'food'
      })
      .expect(201);
    if (expRes.body.perPerson !== 500) throw new Error('perPerson should be 500');
    console.log('✓ Expense created (perPerson 500)');

    // 8. Group details -> balances keyed by member name
    const detail = await request(app)
      .get(`${base}/groups/${groupId}`)
      .set(auth)
      .expect(200);
    const balances = detail.body.balances;
    const total = Object.values(balances).reduce((s, b) => s + b.balance, 0);
    if (Math.abs(total) > 0.01) throw new Error('Balances should sum to zero');
    console.log('✓ Balances sum to zero:', JSON.stringify(balances));

    // 9. Settlement optimization
    const settle = await request(app).post(`${base}/settle/${groupId}`).set(auth).expect(200);
    if (settle.body.totalTransactions !== 2) {
      throw new Error('Expected 2 transactions, got ' + settle.body.totalTransactions);
    }
    console.log('✓ Settlements optimized to 2 transactions');

    // 10. Mark a settlement paid
    const first = settle.body.settlements[0];
    await request(app).put(`${base}/settle/${first._id}/pay`).set(auth).expect(200);
    console.log('✓ Mark settlement paid');

    // 11. Settlement history
    const history = await request(app)
      .get(`${base}/settle/history/${groupId}`)
      .set(auth)
      .expect(200);
    if (history.body.settlements.length === 0) throw new Error('No history');
    console.log('✓ Settlement history OK');

    // 12. Unauthenticated -> 401
    await request(app).get(`${base}/groups`).expect(401);
    console.log('✓ Unauthorized rejected');

    // 13. Health
    await request(app).get('/health').expect(200);
    console.log('✓ Health check OK');

    console.log('\nALL SMOKE TESTS PASSED ✅');
  } catch (err) {
    console.error('\nSMOKE TEST FAILED ❌', err.message);
    console.error(err.stack && err.stack.split('\n').slice(0, 4).join('\n'));
    process.exitCode = 1;
  } finally {
    try {
      const mongoose = require('mongoose');
      await mongoose.disconnect();
    } catch {}
    if (mongod) await mongod.stop();
    process.exit(process.exitCode || 0);
  }
})();