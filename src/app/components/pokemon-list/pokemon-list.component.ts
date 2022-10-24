import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PokemonDetail } from 'src/app/models/pokemon.detail';
import { PokemonList } from 'src/app/models/pokemon.list';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.sass'],
})
export class PokemonListComponent implements OnInit {
  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  classicMode: boolean = true;

  offset: number;
  isLoading: boolean = false;
  isLastPage = false;
  isFirstPage = true;
  searchPokemon: PokemonDetail = new PokemonDetail();
  isSearching = false;

  constructor(
    private pokemonService: PokemonService,
    private snackBar: MatSnackBar,
    private route: Router
  ) {
    this.offset = 0;
  }

  ngOnInit(): void {
    this.getPage(this.offset);
  }

  getPage(offset: number) {
    if (!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService
        .getPokemonList(offset)
        .subscribe((list: PokemonList[]) => {
          if (list.length === 0) {
            this.isLastPage = true;
          }
          if (this.offset != 0) {
            this.isFirstPage = false;
          } else {
            this.isFirstPage = true;
          }
          if (!this.isLastPage) {
            this.getPokemon(list);
          }
        });
    }
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if (value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;
      this.pokemonService.getPokemonDetail(value).subscribe(
        (pokemon: PokemonDetail) => {
          this.searchPokemon = pokemon;
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.snackBar.open('Sorry, Pokemon not found', 'Ok', {
              duration: 5000,
            });
          }
        }
      );
    }
  }

  next() {
    this.getPage(this.offset);
  }
  prev() {
    const value = this.offset - 40;
    this.offset = value;
    this.getPage(this.offset);
  }

  private getPokemon(list: PokemonList[]) {
    const arr: Observable<PokemonDetail>[] = [];
    list.map((value: PokemonList) => {
      arr.push(this.pokemonService.getPokemonDetail(value.name));
    });

    forkJoin([...arr]).subscribe((pokemons) => {
      this.pokemons = [];
      this.pokemons.push(...pokemons);
      this.offset += 20;
      this.isLoading = false;
    });
  }
  returnInitial() {
    this.route.navigate(['/listpokemons']);
    this.getPage(0);
    this.offset = 0;
    this.isSearching = false;
  }

  getPrincipalType(list: any[]) {
    return list.filter((x) => x.slot === 1)[0]?.type.name;
  }
}
