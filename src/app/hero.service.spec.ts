import { TestBed } from '@angular/core/testing';
import { HeroService, Hero } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes', (done: DoneFn) => {
    service.getHeroes().subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      expect(heroes[0].name).toBeTruthy();
      done();
    });
  });

  it('should return a hero by id', (done: DoneFn) => {
    service.getHero(1).subscribe(hero => {
      expect(hero).toBeTruthy();
      expect(hero?.id).toBe(1);
      done();
    });
  });

  it('should return undefined for non-existent hero id', (done: DoneFn) => {
    service.getHero(999).subscribe(hero => {
      expect(hero).toBeUndefined();
      done();
    });
  });

  it('should add a new hero', (done: DoneFn) => {
    const newHero: Hero = { id: 5, name: 'New Hero' };
    
    service.addHero(newHero).subscribe(hero => {
      expect(hero).toEqual(newHero);
      
      // Verify the hero was added to the list
      service.getHero(5).subscribe(addedHero => {
        expect(addedHero).toEqual(newHero);
        done();
      });
    });
  });

  it('should update an existing hero', (done: DoneFn) => {
    const updatedHero: Hero = { id: 1, name: 'Updated Windstorm' };
    
    service.updateHero(updatedHero).subscribe(hero => {
      expect(hero).toEqual(updatedHero);
      
      // Verify the hero was updated in the list
      service.getHero(1).subscribe(fetchedHero => {
        expect(fetchedHero?.name).toBe('Updated Windstorm');
        done();
      });
    });
  });

  it('should return undefined when updating non-existent hero', (done: DoneFn) => {
    const nonExistentHero: Hero = { id: 999, name: 'Non-existent' };
    
    service.updateHero(nonExistentHero).subscribe(result => {
      expect(result).toBeUndefined();
      done();
    });
  });

  it('should delete a hero', (done: DoneFn) => {
    // First add a hero to delete
    const heroToDelete: Hero = { id: 6, name: 'Hero to Delete' };
    
    service.addHero(heroToDelete).subscribe(() => {
      // Then delete it
      service.deleteHero(6).subscribe(result => {
        expect(result).toBe(true);
        
        // Verify the hero was deleted
        service.getHero(6).subscribe(deletedHero => {
          expect(deletedHero).toBeUndefined();
          done();
        });
      });
    });
  });

  it('should return false when deleting non-existent hero', (done: DoneFn) => {
    service.deleteHero(999).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});