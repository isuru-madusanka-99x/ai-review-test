import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroService, Hero } from '../hero.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>My Heroes</h2>
      <ul class="heroes">
        <li *ngFor="let hero of heroes" [class.selected]="hero === selectedHero" (click)="onSelect(hero)">
          <span class="badge">{{hero.id}}</span> {{hero.name}}
          <button class="delete" (click)="delete(hero); $event.stopPropagation()">x</button>
        </li>
      </ul>

      <div *ngIf="selectedHero">
        <h2>{{selectedHero.name | uppercase}} Details</h2>
        <div>id: {{selectedHero.id}}</div>
        <div>
          <label for="hero-name">Hero name: </label>
          <input id="hero-name" [(ngModel)]="selectedHero.name" placeholder="name">
        </div>
        <button (click)="save()">Save</button>
      </div>

      <div>
        <h2>Add a New Hero</h2>
        <div>
          <label for="new-hero-name">Hero name: </label>
          <input id="new-hero-name" #heroName>
        </div>
        <button (click)="add(heroName.value); heroName.value=''">Add</button>
      </div>
    </div>
  `,
  styles: [`
    .heroes {
      list-style-type: none;
      padding: 0;
    }
    .heroes li {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      margin: .5em;
      padding: .3em 0;
      border-radius: 4px;
    }
    .heroes li:hover {
      color: #2c3a41;
      background-color: #e6e6e6;
    }
    .heroes li.selected {
      background-color: #d6e6f7;
    }
    .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #405061;
      line-height: 1em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }
    .delete {
      margin-left: auto;
      background-color: #e64a4a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
    }
    .delete:hover {
      background-color: #d33;
    }
  `]
})
export class HeroListComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHero?: Hero;
  nextId = 100;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    
    const newHero: Hero = { id: this.nextId++, name };
    this.heroService.addHero(newHero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  save(): void {
    if (this.selectedHero) {
      this.heroService.updateHero(this.selectedHero)
        .subscribe(() => {
          // Refresh the list after update
          this.getHeroes();
        });
    }
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
    
    // If the deleted hero was selected, clear the selection
    if (this.selectedHero === hero) {
      this.selectedHero = undefined;
    }
  }
}