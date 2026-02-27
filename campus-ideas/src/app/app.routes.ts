import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ListSuggestionComponent } from './core/list-suggestion/list-suggestion.component';
import { SuggestionFormComponent } from './features/suggestions/suggestion-form/suggestion-form.component';
import { NotfoundComponent } from './core/notfound/notfound.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'listSuggestion', component: ListSuggestionComponent },
  { path: 'addSuggestion', component: SuggestionFormComponent },
  { path: 'editSuggestion/:id', component: SuggestionFormComponent },  // ← Nouvelle route
  { path: '**', component: NotfoundComponent }
];