import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {


  private readonly API = 'https://www.googleapis.com/books/v1/volumes'


  // O HttpClient será usado para realizar as requisições HTTP.
  constructor(private http: HttpClient) { }

  buscar(valorDigitado: string): Observable<Item[]> {
    //Cria um objeto de parâmetros para a requisição HTTP.
    // Aqui, o parâmetro 'q' é adicionado com o valor que o usuário digitou.
    const params = new HttpParams().append('q', valorDigitado )

    // Retorna um Observable que emitirá os dados da resposta quando a requisição for concluída.
    return this.http.get<LivrosResultado>(this.API, { params }).pipe(
      tap((retornoAPI) => console.log('Fluxo do tap', retornoAPI)),
      map(resultado => resultado.items),
      tap(resultado => console.log('Fluxo do map', resultado))
    )
  }
}
