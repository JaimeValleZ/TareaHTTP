import { Component, OnInit } from '@angular/core';
import { Usuario } from './Models/Usuario.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  

  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = {id: 0, nombre: '', email: '', empresa: ''}

  private idContador: number  = 11; 
  editingUserId: number | null = null;

  constructor(private htttp: HttpClient){}

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(){

    this.htttp.get<any[]>('https://jsonplaceholder.typicode.com/users').subscribe(data=>{

      this.usuarios=data.map(user => ({
        id:user.id,
        nombre:user.name,
        email:user.email,
        empresa:user.company.name
      }));
    });

  }

  agregarUsuarios(){
    const body ={
      name : this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {

        name: this.nuevoUsuario.empresa
      }
    };

    this.htttp.post('https://jsonplaceholder.typicode.com/users',body).subscribe(response =>{

      console.log("Usuario agreado", response);
      this.nuevoUsuario.id = this.idContador; 
      this.usuarios.push(this.nuevoUsuario);
      this.nuevoUsuario = {id: 0, nombre: '', email: '', empresa: ''};
      this.idContador++;
      this.editingUserId = null;
    })
  }

  editarUsuario(userId: number) {
    this.editingUserId = userId;

  }

  guardarUsuario(userId: number) {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (usuario) {
      const body = {
        name: usuario.nombre,
        email: usuario.email,
        company: {
          name: usuario.empresa
        }
      };

      this.htttp.put(`https://jsonplaceholder.typicode.com/users/${userId}`, body).subscribe(response =>{
        console.log("Usuario actualizado", response);
        this.editingUserId = null;

      });
    }
  }

  cancelarEdicion() {
    this.editingUserId = null; 
  }

  eliminarUsuario(userId: number) {
    this.htttp.delete(`https://jsonplaceholder.typicode.com/users/${userId}`).subscribe(response => {
      console.log("Usuario eliminado", response);
      this.usuarios = this.usuarios.filter(u => u.id !== userId);
    });
  }
}

  