import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDefaultComponent } from './movie-default.component';

describe('MovieDefaultComponent', () => {
  let component: MovieDefaultComponent;
  let fixture: ComponentFixture<MovieDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
