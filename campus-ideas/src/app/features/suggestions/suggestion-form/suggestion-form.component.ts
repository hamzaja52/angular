import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
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

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const formValue = this.suggestionForm.getRawValue();
      
      const newSuggestion: Suggestion = {
        id: this.generateId(),
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(formValue.date),
        status: formValue.status,
        nbLikes: 0
      };

      const suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
      
      suggestions.push(newSuggestion);
      
      localStorage.setItem('suggestions', JSON.stringify(suggestions));

      alert('Suggestion ajoutée avec succès !');

      this.router.navigate(['/listSuggestion']);
    }
  }

  private generateId(): number {
    const suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
    if (suggestions.length === 0) return 1;
    return Math.max(...suggestions.map((s: Suggestion) => s.id)) + 1;
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