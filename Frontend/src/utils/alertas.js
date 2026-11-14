import Swal from 'sweetalert2';

export function alertaSucesso(titulo) {
  Swal.fire({
    icon: 'success',
    title: titulo,
    timer: 1500,
    showConfirmButton: false,
  });
}

export function alertaErro(texto) {
  Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: texto,
  });
}

export async function confirmarExclusao() {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Essa ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
  });
  return resultado.isConfirmed;
}
