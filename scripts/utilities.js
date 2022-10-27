export const showError = (err) => {
  if (err.response.status === 400 || err.response.status === 403 || err.response.status === 404) {
    Swal.fire({
      title: `${err.response.data.message}`,
      icon: 'error',
      confirmButtonText: '確定',
    });
  }
};

export const showSuccess = (mes) => {
  Swal.fire({
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
    title: mes,
  });
};

export const currency = (number) => {
  return '$' + number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};
