import React from 'react';
import { render, screen } from '@testing-library/react';
import Topbar from './Topbar';

test('renders learn react link', () => {
  render(<Topbar />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
