# AI Coding Agent Instructions - Bash Stash Client

## Project Overview
**Bash Stash** is a React application that helps developers organize development projects with reusable command stashes and color palettes. The frontend connects to a Django REST API backend and generates bash scripts and README files for project bootstrapping.

## Essential Architecture Knowledge

### Technology Stack
- **React 19.1.1** with React Router 7.8.0
- **Authentication**: Token-based with Django REST API backend at `localhost:8000`
- **Styling**: CSS custom properties with design system variables
- **Build**: Create React App (CRA) setup
- **Assets**: SVG images in `/public/assets/images/`

### Project Structure
```
src/
├── components/           # UI components by category
│   ├── common/          # Reusable components (ActionButton, FormField, etc.)
│   ├── project/         # Project-specific components
│   └── tabs/            # Tab-related components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Utility functions and constants
└── views/               # Main page components
```

## Critical Service Layer Patterns

### Authentication Flow
- **Token Storage**: localStorage with keys `auth_token` and `user_data`
- **Service Pattern**: All services use `getToken()` from AuthContext
- **Error Handling**: 401 responses trigger automatic logout and redirect
- **Headers**: `Authorization: Token ${token}` for authenticated requests

```javascript
// Example service method pattern
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Trigger logout and redirect
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
};
```

### Service Layer Structure
- **Base URL**: `http://localhost:8000/api` (from `utils/constants.js`)
- **Services**: `projectService`, `commandService`, `colorPaletteService`, `auth`
- **Pattern**: Each service exports async functions that handle auth tokens and error responses
- **Consistency**: All services follow the same error handling and token management patterns

## Component Architecture

### ActionButton Component
**Purpose**: Unified button component with multiple variants and sizes
**Key Variants**: `primary`, `secondary`, `accent`, `back`, `add`, `tab`, `edit`, `delete`, `launch`
**Sizes**: `sm`, `md`, `lg`, `xs`
**Usage**: Import and use with variant/size props for consistent styling

```jsx
<ActionButton variant="primary" size="md" onClick={handleClick}>
  Save Changes
</ActionButton>
```

### FormField Component
**Purpose**: Consistent form inputs with labels, validation, and styling
**Features**: Text inputs, textareas, color inputs, error states, required indicators
**Pattern**: Controlled components with `value` and `onChange` props

```jsx
<FormField
  label="Project Title"
  value={formData.title}
  onChange={(value) => setFormData({...formData, title: value})}
  required
  disabled={loading}
/>
```

### MaterialIcon Component
**Purpose**: Material Symbols font icon wrapper
**Configuration**: Size, color, filled state, weight customization
**CSS Dependency**: Requires Material Symbols font loaded in HTML

## Design System

### CSS Custom Properties (in `src/root.css`)
```css
:root {
  --color-primary: #fee394;    /* Warm yellow */
  --color-secondary: #d46a6a;  /* Coral red */
  --color-accent: #46cba7;     /* Teal green */
  --bg-primary: #0c0806;       /* Dark brown */
  --bg-secondary: #1a1613;     /* Lighter dark */
  --text: #f5f5dc;             /* Beige text */
  --muted: #8b8680;            /* Muted text */
  --border: #2a2520;           /* Border color */
}
```

### Animation System
- **Page Transitions**: `.page-enter` class with subtle fade-in
- **Hover Effects**: Transform and color transitions on interactive elements
- **Duration**: 0.2s ease transitions for most UI elements

## Data Flow Patterns

### Project Data Structure
```javascript
// Project object expected shape
{
  id: number,
  title: string,
  description: string,
  commands_preview: Array,      // For project cards
  color_palette_preview: Object // For project cards
}
```

### State Management
- **Context**: AuthContext for authentication state
- **Local State**: useState for component state
- **Form Handling**: Controlled components with object spreading patterns
- **Loading States**: Boolean flags for async operations

### API Integration
- **CRUD Operations**: Full Create, Read, Update, Delete for projects, commands, and palettes
- **Error Boundaries**: Try-catch blocks with user-friendly error messages
- **Loading States**: Spinner components during async operations

## Utility Functions

### Script Generation
- **generateBashScript()**: Creates bash scripts from project data
- **generateReadme()**: Creates markdown README from project templates
- **File Operations**: `downloadFile()`, `copyToClipboard()` utilities

### Validation
- **validateHex()**: Hex color validation in `utils/validateHex.js`
- **Form Validation**: Inline validation in components

## Critical Development Patterns

### File Imports
- **Relative Imports**: Use `.jsx` extensions explicitly
- **CSS Imports**: Component-specific CSS files imported in component files
- **Asset Paths**: Public assets use `/assets/` prefix (e.g., `/assets/images/logo.svg`)

### Component Composition
- **Prop Drilling**: Pass callbacks and state through props
- **Event Handling**: Use descriptive handler names (`onSave`, `onCancel`, `onEdit`)
- **Conditional Rendering**: Ternary operators for simple conditions, early returns for complex logic

### Error Handling
- **User-Facing Errors**: Always provide actionable error messages
- **Console Logging**: Use descriptive prefixes (✅, ❌, 🔄) for console logs
- **Graceful Degradation**: Handle missing data with fallbacks

## Common Gotchas & Best Practices

### Authentication
- **Always check token expiry**: Services handle 401s automatically
- **Use AuthContext**: Don't access localStorage directly for auth state
- **Protected Routes**: Wrap authenticated pages with `ProtectedRoute`

### CSS & Styling
- **Custom Properties**: Use CSS variables for colors, spacing, and breakpoints
- **Component CSS**: Each component has its own CSS file
- **Responsive Design**: Mobile-first approach with min-width media queries

### API Calls
- **Loading States**: Always show loading indicators for async operations
- **Error Handling**: Catch and display user-friendly error messages
- **Data Freshness**: Refetch data after mutations

### Form Handling
- **Controlled Components**: Always use controlled inputs with React state
- **Validation**: Validate on input change and form submission
- **Disabled States**: Disable form elements during submission

## Development Workflow

### Adding New Features
1. **Service Layer**: Add API calls to appropriate service file
2. **Components**: Create/update components with proper prop interfaces
3. **Styling**: Add component-specific CSS with design system variables
4. **Integration**: Wire up components in view files with state management
5. **Error Handling**: Add loading states and error boundaries

### Common File Patterns
- **Services**: `src/services/{feature}Service.js` - API interaction
- **Components**: `src/components/{category}/{Component}.jsx` - UI components
- **Styles**: `src/components/{category}/{Component}.css` - Component styles
- **Views**: `src/views/{Page}.jsx` - Route-level page components
- **Utils**: `src/utils/{utility}.js` - Helper functions

### Testing Considerations
- **API Mocking**: Mock service layer functions for component tests
- **Component Props**: Test all prop combinations and states
- **User Interactions**: Test form submissions, button clicks, and navigation

## Quick Reference

### Key Constants (from `utils/constants.js`)
```javascript
export const API_BASE_URL = "http://localhost:8000/api";
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  NEW_PROJECT: "/projects/new"
};
```

### Common Import Patterns
```javascript
// Services
import { getProjects, createProject } from "../services/projectService";

// Components
import { ActionButton } from "../components/common/ActionButton.jsx";
import { FormField } from "../components/common/FormField.jsx";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Router
import { useNavigate, useParams } from "react-router-dom";
```

This documentation should help AI agents understand the essential patterns and conventions needed to work effectively with this React codebase.
