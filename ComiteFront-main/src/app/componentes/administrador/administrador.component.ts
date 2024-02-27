import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  roles: string[] = [];
  users: any[] = [];
  selectedUser: any = null; 
  newUser: any = {
    name: '',
    email: '',
    roles: '',
    password: ''
  };  
  showAddForm: boolean = false;
  userEmail: string | null = ''; 
  showLogoutOption: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.getAllUsers();
    this.getRoles();
  }
  logout() {
    // Mostrar alerta de confirmación usando SweetAlert2
    Swal.fire({
      title: '¿Seguro que quieres cerrar sesión?',
      text: 'Tu sesión actual se cerrará',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        // Redireccionar a la página de inicio de sesión
        window.location.href = '/ruta-de-inicio-de-sesion'; // Reemplaza '/ruta-de-inicio-de-sesion' con la ruta real de tu página de inicio de sesión
      }
    });
  }
  getRoles(): void {
    this.authService.getRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error al obtener roles:', error);
      }
    );
  }
  
  getAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  eliminarUsuario(userId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario hace clic en "Sí, eliminar"
        this.authService.deleteUser(userId).subscribe(
          response => {
            console.log('Usuario eliminado exitosamente:', response);
            // Mostrar mensaje de éxito con SweetAlert2
            Swal.fire('Éxito', 'Usuario eliminado exitosamente', 'success');
            // Actualizar la lista de usuarios después de la eliminación
            this.getAllUsers();
          },
          error => {
            console.error('Error al eliminar usuario:', error);
            // Mostrar mensaje de error con SweetAlert2
            Swal.fire('Error', 'Error al eliminar usuario', 'error');
          }
        );
      }
    });
  }
  
  editarUsuario(user: any): void {
    this.selectedUser = { ...user }; 
  }

  guardarCambios(): void {
    if (this.selectedUser) {
      this.authService.updateUsuario(this.selectedUser._id, this.selectedUser).subscribe(
        response => {
          Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');

          this.getAllUsers();
          this.cerrarModal();
        },
        error => {
          console.error('Error al actualizar usuario:', error);
          Swal.fire('Error', 'Error al actualizar usuario', 'error');
        }
      );
    }
  }

  cerrarModal(): void {
    this.selectedUser = null;
  }
  cancelarEdicion(): void {
    Swal.fire({
      title: 'Cancelado',
      text: 'La edición ha sido cancelada',
      icon: 'info',
      confirmButtonText: 'Ok',
      timer: 2000, // Duración en milisegundos (2 segundos)
      timerProgressBar: true, // Muestra una barra de progreso
    });
  
    this.selectedUser = null;
  }
  

agregarUsuario(): void {
    this.authService.createUser(this.newUser).subscribe(
      response => {
        console.log('Usuario creado exitosamente:', response);
        Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
        this.getAllUsers();
        this.newUser = {
          name: '',
          email: '',
          roles: '',
          password: ''
        };
        this.cerrarFormularioAgregar();
      },
      error => {
        console.error('Error al crear usuario:', error);
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire('Error', 'Error al crear usuario', 'error');
      }
    );
  }
  cerrarFormularioAgregar(): void {
    this.showAddForm = false;
  }
  

  mostrarFormularioAgregar(): void {
    this.showAddForm = true;
  }
  cancelarAgregarUsuario(): void {
    Swal.fire({
      title: 'Cancelado',
      text: 'La creación de usuario ha sido cancelada',
      icon: 'info',
      confirmButtonText: 'Ok',
      timer: 2000  // Tiempo en milisegundos (en este caso, 2 segundos)
    });
  
    this.showAddForm = false;
    this.newUser = {
      name: '',
      email: '',
      roles: '',
      password: ''
    };
  }
  

}
