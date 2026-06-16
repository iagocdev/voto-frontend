import { Component } from '@angular/core';
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
  cargoBusca: string = 'Deputado Federal';

  // Variáveis para guardar a resposta do Java
  resultado: ResultadoArrastaoDTO | null = null;
  mensagemErro: string = '';

  // Injetando o nosso mensageiro
  constructor(private candidatoService: CandidatoService) {}

  // A função que roda quando o usuário clica no botão "Pesquisar"
  buscarImpacto() {
    // Validação básica para evitar buscas vazias
    if (!this.numeroBusca || !this.estadoBusca || !this.cargoBusca) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      return;
    }

    this.mensagemErro = '';
    this.resultado = null;

    // Chama o back-end em Java
    this.candidatoService.simularArrastao(this.numeroBusca, this.estadoBusca, this.cargoBusca)
      .subscribe({
        next: (dados) => {
          this.resultado = dados; // Guarda o JSON na variável para o HTML desenhar
        },
        error: (erro) => {
          this.mensagemErro = 'Candidato não encontrado ou erro de conexão.';
          console.error(erro);
        }
      });
  }
}