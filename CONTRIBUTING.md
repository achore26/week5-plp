# Contributing to Real-Time Chat Application

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Check existing issues before creating new ones
- Provide detailed information about the problem
- Include steps to reproduce the issue

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide mockups or examples if applicable

### Code Contributions
1. Fork the repository
2. Create a new branch for your feature
3. Write clean, documented code
4. Test your changes thoroughly
5. Submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### Local Development
```bash
# Clone the repository
git clone <your-fork-url>
cd realtime-chat-app

# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

## 📝 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Use async/await for promises

### CSS
- Use consistent naming conventions
- Organize styles logically
- Use CSS variables for theming
- Make responsive designs

### File Structure
- Keep components modular
- Separate concerns properly
- Use descriptive file names
- Follow existing directory structure

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific tests
cd server && npm test
cd client && npm test
```

### Writing Tests
- Write unit tests for new functions
- Test edge cases and error conditions
- Mock external dependencies
- Keep tests simple and focused

## 📦 Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Add Tests**: Include tests for new features
3. **Follow Code Style**: Ensure code follows project conventions
4. **Describe Changes**: Provide clear PR description
5. **Review Process**: Address feedback from reviewers

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
- [ ] Commit messages are clear and descriptive

## 🏷️ Commit Message Format

Use clear and descriptive commit messages:

```
feat: add private messaging functionality
fix: resolve connection timeout issues
docs: update README with new features
style: improve message bubble styling
refactor: reorganize socket event handlers
test: add unit tests for authentication
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: UI/styling changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🎯 Areas for Contribution

### High Priority
- Database integration (PostgreSQL/MongoDB)
- User authentication improvements
- Mobile app development
- Performance optimizations
- Security enhancements

### Medium Priority
- Additional file types support
- Message reactions/emojis
- Theme customization
- Internationalization (i18n)
- Advanced search features

### Low Priority
- Code documentation
- Example applications
- Tutorial creation
- UI/UX improvements

## 🔍 Code Review Guidelines

### For Reviewers
- Be constructive and helpful
- Focus on code quality and functionality
- Suggest improvements, don't just criticize
- Test the changes locally
- Provide specific feedback

### For Contributors
- Be responsive to feedback
- Ask questions if feedback is unclear
- Make requested changes promptly
- Keep discussions focused on the code

## 🚀 Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update README if needed
5. **Tag Release**: Create git tag
6. **Deploy**: Deploy to production

## 📞 Getting Help

- **Discord**: Join our development Discord
- **Issues**: Use GitHub issues for questions
- **Email**: Contact maintainers directly
- **Documentation**: Check existing docs first

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Social media mentions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Real-Time Chat Application! 🎉
