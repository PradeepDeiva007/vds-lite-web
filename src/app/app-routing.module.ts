import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/auth-guard.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{ component: LoginComponent, path: '' },
{
  path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
