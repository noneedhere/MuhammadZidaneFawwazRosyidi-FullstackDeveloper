export const formatCurrency = (amount: number): string => {
  return 'Rp' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatSalaryRange = (min: number, max: number): string => {
  return `${formatCurrency(min)} - ${formatCurrency(max)} / bulan`;
};
