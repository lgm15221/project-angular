import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  private userService = inject(UserService);
  users = signal<User[]>([]);

  constructor() {
    this.userService.getUsers().subscribe(data => this.users.set(data));
  }
}