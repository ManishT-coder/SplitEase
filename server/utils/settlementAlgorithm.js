/**
 * Smart settlement algorithm.
 *
 * 1. Calculate net balance for each group member from expenses.
 * 2. Separate members into debtors (negative balance) and creditors (positive balance).
 * 3. Repeatedly match the largest debtor with the largest creditor,
 *    producing the minimum number of transactions to settle everyone.
 */

const round2 = (value) => Math.round(value * 100) / 100;

const calculateBalances = (expenses, members) => {
  const balances = {};
  members.forEach((member) => {
    const id = typeof member === 'object' ? String(member._id || member) : String(member);
    balances[id] = 0;
  });

  expenses.forEach((expense) => {
    const paidBy = String(expense.paidBy?._id || expense.paidBy);
    const amount = Number(expense.amount) || 0;
    const splitAmong = (expense.splitAmong || []).map((m) =>
      String(m?._id || m)
    );

    if (!splitAmong.length) return;

    const perPerson = round2(amount / splitAmong.length);

    splitAmong.forEach((memberId) => {
      if (!(memberId in balances)) balances[memberId] = 0;
      balances[memberId] = round2(balances[memberId] - perPerson);
    });

    if (paidBy in balances) {
      balances[paidBy] = round2(balances[paidBy] + amount);
    } else {
      balances[paidBy] = round2(amount);
    }
  });

  return balances;
};

const calculateSettlements = (balances) => {
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([person, balance]) => {
    const amount = round2(balance);
    if (amount < 0) {
      debtors.push({ person, amount: Math.abs(amount) });
    } else if (amount > 0) {
      creditors.push({ person, amount });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = round2(Math.min(debtor.amount, creditor.amount));

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount
    });

    debtor.amount = round2(debtor.amount - amount);
    creditor.amount = round2(creditor.amount - amount);

    if (debtor.amount <= 0) debtors.shift();
    if (creditor.amount <= 0) creditors.shift();
  }

  return settlements;
};

module.exports = { calculateBalances, calculateSettlements };