import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Paiement from './Paiement.jsx';
import '@testing-library/jest-dom';



describe('Paiement Component', () => {
  test('should render Paiement component', () => {
    const { getByText } = render(<Paiement total={100} codePromotionnel={false} finaliserAchats={() => {}} />);
    const titleElement = getByText('Procéder au paiement');
    expect(titleElement).toBeInTheDocument();
  });

  test('should handle payment', async () => {
    const finaliserAchats = jest.fn();
    const { getByLabelText, getByText } = render(<Paiement total={100} codePromotionnel={false} finaliserAchats={finaliserAchats} />);

    fireEvent.change(getByLabelText('Nom sur la carte'), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText('Numéro de carte'), { target: { value: '1234567890123456' } });
    fireEvent.change(getByLabelText('Date d\'expiration'), { target: { value: '12/25' } });
    fireEvent.change(getByLabelText('CVV'), { target: { value: '123' } });
    fireEvent.click(getByText('Payer'));

    await waitFor(() => {
      expect(finaliserAchats).toHaveBeenCalled();
    });
  });
});
