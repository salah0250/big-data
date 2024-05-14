import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ReadComponent } from './components/read/read.component';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import {VisitesComponent} from "./components/visites/visites.component";
import {CreateVisitesComponent} from "./components/create-visites/create-visites.component";
import {TraitementComponent} from "./components/traitement/traitement.component";

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'read', component: ReadComponent },
  { path: 'update/:uuid', component: UpdateComponent },
  { path: 'delete', component: DeleteComponent },
  { path: 'visites', component: VisitesComponent},
  { path: 'create-visites', component: CreateVisitesComponent},
  { path: 'traitement', component: TraitementComponent},
  { path: '', redirectTo: '/read', pathMatch: 'full' } // Rediriger vers ReadComponent par défaut
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
