# Contributing to SplitEase

Thank you for your interest in contributing! 🎉

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

---

## 📜 Code of Conduct

- Be respectful to everyone
- Use welcoming and inclusive language
- Focus on constructive feedback
- Help others learn and grow

---

## 🚀 How to Contribute

### 1. Fork the Repository

```bash
# Click the "Fork" button on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/splitease.git
cd splitease
```

### 2. Set Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_USERNAME/splitease.git
git fetch upstream
git checkout main
git merge upstream/main
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

- Write your code
- Test your changes
- Follow coding standards

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add expense deletion feature"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Add description and submit

---

## 💻 Development Setup

### Prerequisites

- Node.js v20+
- MongoDB (local or Atlas)
- Git

### Setup Instructions

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/splitease.git
cd splitease

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 4. Start development
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm start
```

---

## 🌿 Branch Naming

Use this format:

```
<type>/<short-description>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feature` | New feature | `feature/add-export` |
| `fix` | Bug fix | `fix/login-error` |
| `docs` | Documentation | `docs/update-readme` |
| `style` | UI/Styling | `style/improve-navbar` |
| `refactor` | Code refactoring | `refactor/optimize-query` |
| `test` | Tests | `test/add-auth-tests` |
| `chore` | Maintenance | `chore/update-deps` |

### Examples

```
feature/add-settlement-algorithm
fix/calculate-negative-balance
docs/add-api-documentation
style/fix-mobile-responsive
refactor/extract-auth-middleware
```

---

## 💬 Commit Messages

### Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting, missing semicolons |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding tests |
| `chore` | Build process, dependencies |

### Examples

```bash
# Good
git commit -m "feat: add user authentication"
git commit -m "fix: resolve balance calculation bug"
git commit -m "docs: add API endpoint documentation"

# Bad
git commit -m "update code"
git commit -m "fixed stuff"
git commit -m "changes"
```

### Adding Issues

```bash
git commit -m "feat: add expense sharing feature

Closes #42"
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Tested locally
- [ ] Updated documentation (if needed)
- [ ] Branch is up to date with main

### PR Title Format

```
<type>: <short description>
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added tests for new feature

## Screenshots (if UI changes)
[Add screenshots here]

## Related Issues
Closes #<issue-number>
```

### Review Process

1. Submit PR
2. Wait for review (1-2 days)
3. Address feedback
4. Get approval
5. Merge to main

---

## 📏 Coding Standards

### JavaScript/React

```javascript
// ✅ Good
const AddExpense = () => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </form>
  );
};

// ❌ Bad
function addExpense() {
  var amount = ""
  // handle submit
  return <form>...</form>
}
```

### File Naming

```
✅ PascalCase for components: Navbar.jsx, ExpenseCard.jsx
✅ camelCase for functions: handleSubmit, formatDate
✅ kebab-case for folders: expense-components, auth-utils
✅ UPPERCASE for constants: API_URL, JWT_SECRET
```

### CSS/Tailwind

```jsx
// ✅ Good — Use Tailwind classes
<div className="bg-white rounded-lg shadow-md p-4">
  <h2 className="text-xl font-bold text-gray-800">Expense</h2>
</div>

// ❌ Bad — Inline styles
<div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Expense</h2>
</div>
```

### API Routes

```javascript
// ✅ Good — RESTful naming
GET    /api/groups           // Get all groups
POST   /api/groups           // Create group
GET    /api/groups/:id       // Get group
PUT    /api/groups/:id       // Update group
DELETE /api/groups/:id       // Delete group

// ❌ Bad
GET    /api/getGroups
POST   /api/createNewGroup
GET    /api/groupDetails
```

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node.js version: [e.g., 20.x]
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
[Clear description of the feature]

## Problem it Solves
[What problem does this solve?]

## Proposed Solution
[How should it work?]

## Alternatives Considered
[Any other solutions?]

## Additional Context
[Screenshots, examples, etc.]
```

---

## ❓ Need Help?

- Open an issue with `question` label
- Check existing documentation
- Ask in discussions

---

## 🎉 Thank You!

Every contribution helps make SplitEase better. Thank you for taking the time to contribute!
