import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieWatchListComponent } from './movie-watch-list.component';

describe('MovieWatchListComponent', () => {
  let component: MovieWatchListComponent;
  let fixture: ComponentFixture<MovieWatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieWatchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieWatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
