import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent implements OnDestroy {
  listaLivros: [];
  campoBusca: string = '';
  subscription: Subscription

  constructor(private service: LivroService) {}

  buscarLivros() {
    this.subscription = this.service.buscar(this.campoBusca).subscribe({// subscribe conecta o Observable com o Observer
      next: (retornoAPI) => console.log(retornoAPI), // next recebe o retorno da API e imprime no console
      error: erro => console.error(erro),
      complete: () => console.log('Observable completo')
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // unsubscribe desliga o Observable
  }
}
