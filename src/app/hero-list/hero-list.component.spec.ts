import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { HeroListComponent } from './hero-list.component';
import { HeroService, Hero } from '../hero.service';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let mockHeroes: Hero[];

  beforeEach(async () => {
    mockHeroes = [
      { id: 1, name: 'Test Hero 1' },
      { id: 2, name: 'Test Hero 2' }
    ];

    // Create a mock HeroService with jasmine.createSpyObj
    heroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'updateHero', 'deleteHero']);
    
    // Set up the return values for the mock methods
    heroService.getHeroes.and.returnValue(of(mockHeroes));
    heroService.addHero.and.returnValue(of({ id: 100, name: 'New Test Hero' }));
    heroService.updateHero.and.callFake((hero: Hero) => of(hero));
    heroService.deleteHero.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [FormsModule, HeroListComponent],
      providers: [
        { provide: HeroService, useValue: heroService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heroes from the service', () => {
    expect(heroService.getHeroes).toHaveBeenCalled();
    
    const heroElements = fixture.debugElement.queryAll(By.css('.heroes li'));
    expect(heroElements.length).toBe(2);
    expect(heroElements[0].nativeElement.textContent).toContain('Test Hero 1');
    expect(heroElements[1].nativeElement.textContent).toContain('Test Hero 2');
  });

  it('should select a hero when clicked', () => {
    const heroElements = fixture.debugElement.queryAll(By.css('.heroes li'));
    heroElements[0].triggerEventHandler('click', null);
    
    expect(component.selectedHero).toEqual(mockHeroes[0]);
    
    fixture.detectChanges();
    
    // Check if the hero details section is visible
    const heroNameInput = fixture.debugElement.query(By.css('input#hero-name'));
    expect(heroNameInput).toBeTruthy();
  });

  it('should add a new hero', () => {
    // Get the initial heroes count
    const initialCount = component.heroes.length;
    
    // Call the component method directly
    component.add('New Test Hero');
    
    // Verify the service was called with the right parameters
    expect(heroService.addHero).toHaveBeenCalledWith({ id: 100, name: 'New Test Hero' });
    
    // Verify the hero was added to the component's heroes array
    expect(component.heroes.length).toBe(initialCount + 1);
  });

  it('should not add a hero with empty name', () => {
    // Call the component method directly with an empty string
    component.add('');
    
    // Verify the service was not called
    expect(heroService.addHero).not.toHaveBeenCalled();
    
    // Verify the heroes array remains unchanged
    expect(component.heroes.length).toBe(2);
  });

  it('should save hero changes', () => {
    // First select a hero
    component.onSelect(mockHeroes[0]);
    expect(component.selectedHero).toEqual(mockHeroes[0]);
    
    // Modify the hero name
    if (component.selectedHero) {
      component.selectedHero.name = 'Updated Hero Name';
    }
    
    // Call the save method directly
    component.save();
    
    // Verify the service was called with the updated hero
    expect(heroService.updateHero).toHaveBeenCalledWith({ id: 1, name: 'Updated Hero Name' });
    
    // Verify getHeroes was called to refresh the list
    expect(heroService.getHeroes).toHaveBeenCalledTimes(2); // Once on init, once after save
  });

  it('should delete a hero', () => {
    // Call the delete method directly
    component.delete(mockHeroes[0]);
    
    // Verify the service was called with the correct hero id
    expect(heroService.deleteHero).toHaveBeenCalledWith(1);
    
    // Verify the hero was removed from the component's heroes array
    expect(component.heroes.length).toBe(1);
    expect(component.heroes[0].id).toBe(2);
  });

  it('should clear selection when selected hero is deleted', () => {
    // First select a hero
    component.onSelect(mockHeroes[0]);
    expect(component.selectedHero).toEqual(mockHeroes[0]);
    
    // Then delete it
    component.delete(mockHeroes[0]);
    
    // Verify the selection was cleared
    expect(component.selectedHero).toBeUndefined();
  });
});