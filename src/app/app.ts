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
  
  // Lista dinâmica
  cargosDisponiveis: string[] = ['Deputado Federal', 'Deputado Estadual'];

  // Variáveis de resposta
  resultado: ResultadoArrastaoDTO | null = null;
  mensagemErro: string = '';

  // 1. ADICIONE A VARIÁVEL DE CONTROLE DE CARREGAMENTO AQUI 👇
  carregando: boolean = false; 

  // Injeção do construtor mantida e segura
  constructor(
    private candidatoService: CandidatoService, 
    private cdr: ChangeDetectorRef,
    private swUpdate: SwUpdate
  ) {}

  // Essa função roda automaticamente quando a tela abre
  ngOnInit() {
    this.verificarAtualizacoesPWA();
  }

  verificarAtualizacoesPWA() {
    // Primeiro checa se o navegador suporta e se o Service Worker está ligado
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evento) => {
        // Se o evento avisar que a versão nova já foi baixada e está pronta...
        if (evento.type === 'VERSION_READY') {
          // Mostra um alerta padrão do navegador
          const atualiza = confirm('🚀 Uma nova versão do Simulador está disponível! Deseja atualizar agora para carregar as novidades?');
          
          if (atualiza) {
            // Força o recarregamento limpando o cache antigo automaticamente
            window.location.reload();
          }
        }
      });
    }
  }

  // Motor Dinâmico de Cargos: Roda a cada letra digitada no campo de Estado
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
    
    // Força a tela a atualizar o Select de cargos imediatamente
    this.cdr.detectChanges();
  }

  // A função que roda quando o usuário clica no botão "Pesquisar"
  buscarImpacto() {
    console.log("Enviando para o Java -> Número:", this.numeroBusca, " | Estado:", this.estadoBusca, " | Cargo:", this.cargoBusca);
    
    // 1. Validação de campos vazios
    if (!this.numeroBusca || !this.estadoBusca || !this.cargoBusca) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      this.cdr.detectChanges(); // Atualiza a tela com o erro
      return;
    }

    // 2. Trava de Segurança do TSE (Tamanho do Número)
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

    // Passou nas travas: limpa erros e prepara para buscar
    this.mensagemErro = '';
    this.resultado = null;
    
    // 2. LIGA O SPINNER DE CARREGAMENTO AQUI 
    this.carregando = true;
    this.cdr.detectChanges(); 

    // Chama o back-end em Java
    this.candidatoService.simularArrastao(this.numeroBusca, this.estadoBusca.trim().toUpperCase(), this.cargoBusca)
      .subscribe({
        next: (dados) => {
          this.resultado = dados; 

          // Atraso artificial de 1 segundo só para vermos a animação
          setTimeout(() => {
            this.carregando = false;
            this.cdr.detectChanges(); 
          }, 1000);
          
          // 3. DESLIGA O SPINNER AQUI (SUCESSO) 
          this.carregando = false;
          this.cdr.detectChanges(); 
        },
        error: (erro) => {
          this.mensagemErro = 'Candidato não encontrado ou erro de conexão.';
          
          // 4. DESLIGA O SPINNER AQUI (ERRO) 
          this.carregando = false;
          this.cdr.detectChanges(); 
          console.error(erro);
        }

        
      });
  }
}