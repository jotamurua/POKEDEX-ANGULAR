import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonDetail } from 'src/app/models/pokemon.detail';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.sass'],
})
export class PokemonDetailComponent implements OnInit {
  search: FormControl = new FormControl('');
  pokemon!: PokemonDetail;
  id!: number;
  searchPokemon: PokemonDetail = new PokemonDetail();

  pokemongif: string = '';
  routeSub!: Subscription;
  isLoading: boolean = false;
  isSearching = false;

  constructor(
    private _pokemonService: PokemonService,
    private aRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeSub = this.aRoute.params.subscribe((data) => {
      this.id = data['id'];
      this.getPokemon();
    });
  }
  getPokemon() {
    this.isLoading = true;
    this._pokemonService.getPokemonDetail(this.id).subscribe((data) => {
      this.isLoading = false;
      this.pokemon = data;
      this.pokemongif = `https://projectpokemon.org/images/normal-sprite/${this.pokemon.name}.gif`;
    });
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if (value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;
      this._pokemonService.getPokemonDetail(value).subscribe(
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

  getPrincipalType(list: any[]) {
    return list.filter((x) => x.slot === 1)[0]?.type.name;
  }
}
