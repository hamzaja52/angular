import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Suggestion } from '../../models/suggestion';
import { SuggestionService } from '../services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {
  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  searchTerm: string = '';

  constructor(private suggestionService: SuggestionService) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  // Charger les suggestions depuis l'API
  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des suggestions:', error);
        alert('Erreur lors du chargement des suggestions. Vérifiez que le backend est lancé.');
      }
    });
  }

  // Incrémenter les likes
  incrementLikes(suggestion: Suggestion): void {
    const newLikes = suggestion.nbLikes + 1;
    this.suggestionService.updateLikes(suggestion.id, newLikes).subscribe({
      next: () => {
        suggestion.nbLikes = newLikes;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des likes:', error);
      }
    });
  }

  // Supprimer une suggestion
  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          // Recharger la liste après suppression
          this.loadSuggestions();
          alert('Suggestion supprimée avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la suggestion.');
        }
      });
    }
  }

  // Ajouter aux favoris
  addToFavorites(suggestion: Suggestion): void {
    if (!this.favorites.find(fav => fav.id === suggestion.id)) {
      this.favorites.push(suggestion);
      alert(`"${suggestion.title}" ajoutée aux favoris!`);
    } else {
      alert('Cette suggestion est déjà dans vos favoris!');
    }
  }

  // Filtrer les suggestions
  get filteredSuggestions(): Suggestion[] {
    if (!this.searchTerm) {
      return this.suggestions;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.suggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(term) ||
      suggestion.category.toLowerCase().includes(term)
    );
  }
}