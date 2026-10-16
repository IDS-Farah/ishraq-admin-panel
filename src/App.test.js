import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders the sign-in screen', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );

  expect(screen.getByRole('heading', { name: /employer sign in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in as employer/i })).toBeInTheDocument();
});

test('renders the 404 page for unknown routes', () => {
  window.history.pushState({}, '', '/this-route-does-not-exist');

  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );

  expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
});
