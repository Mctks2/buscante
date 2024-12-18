import { switchMap, map, tap, filter, debounceTime, throwError, catchError} from 'rxjs';
import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 1, transform: 'none', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
        query(':leave', [
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 1, transform: 'none', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ]
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();  // Campo de busca vinculado ao formulário
  mensagemErro = '' // Mensagem de erro exibida ao usuário
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  // totalDeLivros$ = this.campoBusca.valueChanges
  // .pipe(
  //   debounceTime(PAUSA),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   tap(() => console.log('Fluxo inicial')),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map(resultado => this.livrosResultado = resultado),
  //   catchError(erro => {
  //     console.log(erro)
  //     return of()
  //   })
  // )

  // Observable para buscar os livros
  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA), // Aguarda o usuário parar de digitar por 300ms
      filter((valorDigitado) => valorDigitado.length >= 3), // Apenas valores com 3 ou mais caracteres
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)), // Faz uma requisição HTTP
      map(resultado => this.livrosResultado = resultado), // Armazena o resultado da requisição em livrosResultado
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []), // Se items for nulo, retorna um array vazio
      map((items) => this.livrosResultadoParaLivros(items)), // Transforma os itens da API em objetos LivroVolumeInfo
      catchError((erro) => {
        // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
        // return EMPTY
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
      })
    )


  // Função que transforma os itens da API em objetos LivroVolumeInfo
  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}

