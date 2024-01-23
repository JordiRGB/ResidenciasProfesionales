import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null; 
  newUser: any = {
    name: '',
    email: '',
    roles: '',
    password: ''
  };  
  showAddForm: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllUsers();
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

  editarUsuario(user: any): void {
    this.selectedUser = { ...user }; // Crear una copia para no afectar directamente el usuario original
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
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
        // Actualizar la lista de usuarios después de la creación
        this.getAllUsers();
        // Limpiar datos del nuevo usuario
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
