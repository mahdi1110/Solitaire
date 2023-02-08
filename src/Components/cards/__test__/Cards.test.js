import React from 'react';
import { render, screen } from '@testing-library/react';
import CardComponent from '../cards';

test('renders learn react link', async() => {
  render(<CardComponent card={Card} />);
  const Card = screen.getByTestId()
    expect(Card).toBeInTheDocument();
});
