import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders the demo sign-in screen', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );

  expect(screen.getByRole('heading', { name: /admin sign in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /fill admin demo login/i })).toBeInTheDocument();
});
