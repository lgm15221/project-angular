import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Users } from './pages/users/users';

export const routes: Routes = [{ path: '', component: Home }, { path: 'users', component: Users }];
