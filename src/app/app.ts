import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatoService } from './services/candidato';
import { ResultadoArrastaoDTO } from './models/candidato.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',  
  styleUrl: './app.css'       
})
export class App {
  
  // Variáveis ligadas aos inputs da tela
  numeroBusca: number | null = null;
  estadoBusca: string = '';
  cargoBusca: string = '';

  // Variáveis para guardar a resposta do Java
  resultado: ResultadoArrastaoDTO | null = null;
  mensagemErro: string = '';

  // Injetando o nosso mensageiro
  constructor(private candidatoService: CandidatoService, private cdr: ChangeDetectorRef) {}
  

  // A função que roda quando o usuário clica no botão "Pesquisar"
  buscarImpacto() {
    console.log("Enviando para o Java -> Número:", this.numeroBusca, " | Estado:", this.estadoBusca, " | Cargo:", this.cargoBusca);
    // Validação básica para evitar buscas vazias
    if (!this.numeroBusca || !this.estadoBusca || !this.cargoBusca) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      return;
    }

    this.mensagemErro = '';
    this.resultado = null;

    // Chama o back-end em Java
    this.candidatoService.simularArrastao(this.numeroBusca, this.estadoBusca.trim().toUpperCase(), this.cargoBusca)
      .subscribe({
        next: (dados) => {
          this.resultado = dados; // Guarda o JSON na variável para o HTML desenhar
          this.cdr.detectChanges(); // Força a detecção de mudanças
        },
        error: (erro) => {
          this.mensagemErro = 'Candidato não encontrado ou erro de conexão.';
          this.cdr.detectChanges(); // Força a detecção de mudanças para mostrar a mensagem de erro
          console.error(erro);
        }
      });
  }
}