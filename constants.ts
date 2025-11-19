
// Zde definujeme váš fixní účet.
// Původní číslo: 35-9706800297/0100
export const MY_ACCOUNT_NUMBER = "35-9706800297/0100";

// Pro QR platby je nutné použít formát IBAN.
// Vypočteno z čísla účtu výše.
export const MY_IBAN = "CZ7101000000359706800297"; 

export const DEFAULT_CURRENCY = "CZK";

// Helper to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  }).format(amount);
};
