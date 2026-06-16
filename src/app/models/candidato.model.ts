export interface Candidato {
    id: number;
    nomeUrna: string;
    numero: number;
    cargo: string;
    estadoUf: string;
    partido: string;
    federacao: string;
    situacao: string;
}

export interface ResultadoArrastaoDTO {
    candidatoPrincipal: Candidato;
    beneficiados: Candidato[];
}