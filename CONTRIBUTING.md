# Contributing to Tailwind Builder

First off, thank you for considering contributing to Tailwind Builder! It's people like you that make Tailwind Builder such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guide](#code-style-guide)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this standard. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tailwind-builder.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork and submit a pull request

## How Can I Contribute?

### Reporting Bugs

- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Check if the bug has already been reported
- Include as much detail as possible
- Add screenshots if applicable

### Suggesting Features

- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the use case clearly
- Consider if the feature aligns with the project's goals

### Code Contributions

- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it
- Follow the code style guide below

### Documentation

- Help improve README, tutorials, or code comments
- Fix typos or clarify confusing sections

## Development Setup

```bash
# Clone the repository
git clone https://github.com/mhmdtriobyte/tailwind-builder.git
cd tailwind-builder

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Code Style Guide

### General Principles

- Write clean, readable, and maintainable code
- Follow existing patterns in the codebase
- Keep functions small and focused
- Use meaningful variable and function names

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type
- Export types from dedicated type files

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

// Avoid
const handleClick = (data: any) => { ... }
```

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use proper prop typing

```typescript
// Good
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Tailwind CSS

- Use Tailwind utility classes
- Keep class lists organized (layout, spacing, colors, etc.)
- Use the `cn()` utility for conditional classes
- Prefer responsive utilities over media queries

```typescript
// Good
<div className={cn(
  "flex items-center gap-4",
  "px-4 py-2",
  "bg-white text-gray-900",
  isActive && "ring-2 ring-blue-500"
)} />
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
│   └── Builder/      # Builder-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── store/            # Zustand store
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Commit Message Guidelines

We follow conventional commits for clear and consistent commit history:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(components): add new gradient button component
fix(canvas): resolve drag-drop positioning issue
docs(readme): update installation instructions
refactor(store): simplify element tree operations
```

## Pull Request Process

1. **Before Submitting**
   - Update documentation if needed
   - Run `npm run lint` and fix any issues
   - Run `npm run build` to ensure it builds successfully
   - Test your changes thoroughly

2. **PR Title**
   - Use the same format as commit messages
   - Be descriptive but concise

3. **PR Description**
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots for UI changes

4. **Review Process**
   - PRs require at least one approval
   - Address review comments promptly
   - Keep the PR focused on a single change

5. **After Merge**
   - Delete your branch
   - Celebrate your contribution! 🎉

## Questions?

Feel free to open an issue for any questions or reach out to the maintainers.

Thank you for contributing! ❤️
