import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode = false;
  suggestionId: number | null = null;
  
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.suggestionId = +params['id'];
        this.loadSuggestion(this.suggestionId);
      }
    });
  }

  initForm(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z ]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });
  }

  loadSuggestion(id: number): void {
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (suggestion) => {
        this.suggestionForm.patchValue({
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          date: new Date(suggestion.date).toISOString().split('T')[0],
          status: suggestion.status
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la suggestion:', error);
        alert('Erreur lors du chargement de la suggestion.');
      }
    });
  }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const formValue = this.suggestionForm.getRawValue();
      
      const suggestionData: Suggestion = {
        id: this.suggestionId || 0,
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(formValue.date),
        status: formValue.status,
        nbLikes: 0
      };

      if (this.isEditMode && this.suggestionId) {
        // Mode édition - UPDATE
        this.suggestionService.updateSuggestion(this.suggestionId, suggestionData).subscribe({
          next: () => {
            alert('Suggestion modifiée avec succès !');
            this.router.navigate(['/listSuggestion']);
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification de la suggestion.');
          }
        });
      } else {
        // Mode ajout - POST
        this.suggestionService.addSuggestion(suggestionData).subscribe({
          next: () => {
            alert('Suggestion ajoutée avec succès !');
            this.router.navigate(['/listSuggestion']);
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout:', error);
            alert('Erreur lors de l\'ajout de la suggestion.');
          }
        });
      }
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.suggestionForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.suggestionForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}