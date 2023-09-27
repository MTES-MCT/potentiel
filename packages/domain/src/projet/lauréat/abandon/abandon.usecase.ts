import { DemanderAbandonAvecRecandidatureUseCase } from './demander/demanderAbandon.usecase';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonUsecase = DemanderAbandonAvecRecandidatureUseCase | RejeterAbandonUseCase;
