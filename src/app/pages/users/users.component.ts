import { Component, OnInit } from '@angular/core';
import { UserService, RickAndMortyUser } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usuarios: RickAndMortyUser[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.usuarios = data.results;
    });
  }

  editUser(user: RickAndMortyUser) {
    alert('Função de editar (mock): ' + user.name);
  }

  deleteUser(user: RickAndMortyUser) {
    this.usuarios = this.usuarios.filter(u => u.id !== user.id);
  }
}
