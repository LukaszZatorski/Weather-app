import React from 'react';
import { render } from '@testing-library/react';
import App from '.';

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
  });
  test('has a valid snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
