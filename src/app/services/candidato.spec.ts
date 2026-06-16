import { TestBed } from '@angular/core/testing';

import { Candidato } from './candidato';

describe('Candidato', () => {
  let service: Candidato;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Candidato);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
