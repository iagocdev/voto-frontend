import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoArrastaoDTO } from '../models/candidato.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  
  // A URL base da nossa API Java
  private apiUrl = 'http://127.0.0.1:8080/api/candidatos';

  // Injetamos o HttpClient (o "Postman" interno do Angular)
  constructor(private http: HttpClient) { }

  // Método que vai buscar o nosso JSON montado
  simularArrastao(numero: number, estadoUf: string, cargo: string): Observable<ResultadoArrastaoDTO> {
    
    // Monta os parâmetros que vão na URL (?numero=...&estadoUf=...&cargo=...)
    let params = new HttpParams()
      .set('numero', numero.toString())
      .set('estadoUf', estadoUf)
      .set('cargo', cargo);

    // Faz o GET e avisa que o retorno será no formato da nossa Interface (DTO)
    return this.http.get<ResultadoArrastaoDTO>(`${this.apiUrl}/impacto`, { params });
  }
}