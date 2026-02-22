import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SuggestionFormComponent } from './features/suggestions/suggestion-form/suggestion-form.component';

import { ListSuggestionComponent } from './core/list-suggestion/list-suggestion.component';
import { NotfoundComponent } from './core/notfound/notfound.component';

export const routes: Routes = [
  // Route par défaut - redirige vers /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Route home
  { path: 'home', component: HomeComponent },
  
  // Route liste des suggestions
  { path: 'listSuggestion', component: ListSuggestionComponent },
  { path: 'addSuggestion', component: SuggestionFormComponent },
  
  // Route 404 - doit être en dernier
  { path: '**', component: NotfoundComponent }
];