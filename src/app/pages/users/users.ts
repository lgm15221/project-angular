import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { toSignal } from '@angular/core/rxjs-interop';




@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  private userService = inject(UserService);
  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  /*
  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users.set(data));
  }

  addUser() {
    const nuevo = { name: 'Nuevo usuario', email: 'nuevo@mail.com' };
    this.userService.addUser(nuevo).subscribe(() => this.loadUsers());
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  } */
}