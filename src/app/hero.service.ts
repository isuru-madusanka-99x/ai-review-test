import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Hero {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes: Hero[] = [
    { id: 1, name: 'Windstorm' },
    { id: 2, name: 'Bombasto' },
    { id: 3, name: 'Magneta' },
    { id: 4, name: 'Tornado' }
  ];

  constructor() { }

  getHeroes(): Observable<Hero[]> {
    return of(this.heroes);
  }

  getHero(id: number): Observable<Hero | undefined> {
    return of(this.heroes.find(hero => hero.id === id));
  }

  addHero(hero: Hero): Observable<Hero> {
    this.heroes.push(hero);
    return of(hero);
  }

  updateHero(updatedHero: Hero): Observable<Hero | undefined> {
    const index = this.heroes.findIndex(h => h.id === updatedHero.id);
    if (index !== -1) {
      this.heroes[index] = updatedHero;
      return of(updatedHero);
    }
    return of(undefined);
  }

  deleteHero(id: number): Observable<boolean> {
    const index = this.heroes.findIndex(h => h.id === id);
    if (index !== -1) {
      this.heroes.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}