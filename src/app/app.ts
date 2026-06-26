import { Component, ChangeDetectorRef , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwUpdate } from '@angular/service-worker';
import { CandidatoService } from './services/candidato';
import { ResultadoArrastaoDTO } from './models/candidato.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',  
  styleUrl: './app.css'       
})
export class App implements OnInit {
  
  // Variáveis ligadas aos inputs da tela
  numeroBusca: number | null = null;
  estadoBusca: string = '';
  cargoBusca: string = '';
  
  // 1. NOVA VARIÁVEL: Controla o ano selecionado na tela (Inicia em 2026)
  anoSelecionado: number = 2026; 
  
  // Lista dinâmica de cargos
  cargosDisponiveis: string[] = ['Deputado Federal', 'Deputado Estadual'];

  // Variáveis de resposta
  resultado: ResultadoArrastaoDTO | null = null;
  mensagemErro: string = '';

  // Controle de carregamento (Spinner)
  carregando: boolean = false; 

  constructor(
    private candidatoService: CandidatoService, 
    private cdr: ChangeDetectorRef,
    private swUpdate: SwUpdate
  ) {}

  ngOnInit() {
    this.verificarAtualizacoesPWA();
  }

  verificarAtualizacoesPWA() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evento) => {
        if (evento.type === 'VERSION_READY') {
          const atualiza = confirm('🚀 Uma nova versão do Simulador está disponível! Deseja atualizar agora para carregar as novidades?');
          if (atualiza) {
            window.location.reload();
          }
        }
      });
    }
  }

  atualizarCargos() {
    const estadoFormatado = this.estadoBusca ? this.estadoBusca.trim().toUpperCase() : '';

    if (estadoFormatado === 'DF') {
      this.cargosDisponiveis = ['Deputado Federal', 'Deputado Distrital'];
      if (this.cargoBusca === 'Deputado Estadual') {
        this.cargoBusca = 'Deputado Distrital';
      }
    } else {
      this.cargosDisponiveis = ['Deputado Federal', 'Deputado Estadual'];
      if (this.cargoBusca === 'Deputado Distrital') {
        this.cargoBusca = 'Deputado Estadual';
      }
    }
    this.cdr.detectChanges();
  }

  buscarImpacto() {
    console.log("Enviando para o Java -> Número:", this.numeroBusca, " | Estado:", this.estadoBusca, " | Cargo:", this.cargoBusca, " | Ano:", this.anoSelecionado);
    
    if (!this.numeroBusca || !this.estadoBusca || !this.cargoBusca) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      this.cdr.detectChanges();
      return;
    }

    const tamanhoNumero = this.numeroBusca.toString().length;
    
    if (this.cargoBusca === 'Deputado Federal' && tamanhoNumero !== 4) {
      this.mensagemErro = 'O número para Deputado Federal deve ter exatamente 4 dígitos.';
      this.cdr.detectChanges();
      return;
    }
    
    if ((this.cargoBusca === 'Deputado Estadual' || this.cargoBusca === 'Deputado Distrital') && tamanhoNumero !== 5) {
      this.mensagemErro = `O número para ${this.cargoBusca} deve ter exatamente 5 dígitos.`;
      this.cdr.detectChanges();
      return;
    }

    this.mensagemErro = '';
    this.resultado = null;
    this.carregando = true;
    this.cdr.detectChanges(); 

    // 2. ATUALIZADO: Passando o anoSelecionado como o 4º parâmetro para a API
    this.candidatoService.simularArrastao(
      this.numeroBusca, 
      this.estadoBusca.trim().toUpperCase(), 
      this.cargoBusca, 
      this.anoSelecionado
    )
    .subscribe({
      next: (dados) => {
        // Correção do efeito visual: O estado de carregamento agora desliga estritamente após 1 segundo
        setTimeout(() => {
          this.resultado = dados; 
          this.carregando = false;
          this.cdr.detectChanges(); 
        }, 1000);
      },
      error: (erro) => {
        this.mensagemErro = 'Candidato não encontrado ou erro de conexão.';
        this.carregando = false;
        this.cdr.detectChanges(); 
        console.error(erro);
      }
    });
  }
}