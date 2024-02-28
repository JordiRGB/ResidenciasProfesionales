import { inject } from "@angular/core";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

export const loginbloqueo = () => {

    const router = inject(Router);

    if (localStorage.getItem('token')){
        return true;
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Iniciar Sesión',
            text: 'Debes iniciar sesión para acceder a esta página.',
            showCancelButton: false,
            confirmButtonText: 'Ir a iniciar sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                router.navigate(['/login']);
            }
        });
        return false;
    }
}