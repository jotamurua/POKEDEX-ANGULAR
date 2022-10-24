import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PokemonDetail } from "../models/pokemon.detail";
import { PokemonList } from "../models/pokemon.list";

@Injectable({providedIn: 'root'})
export class PokemonService {
    private baseUrl = 'https://pokeapi.co/api/v2/';

    constructor(private http: HttpClient) { }


    getPokemonList(offset: number) : Observable<PokemonList[]> {
        return this.http.get<PokemonList[]>(`${this.baseUrl}pokemon?offset=${offset}&limit=20`)
        .pipe(
            map((x: any) => x.results)
        );
    }

    getPokemonDetail(pokemon: number | string): Observable<PokemonDetail> {
        return this.http.get<PokemonDetail>(this.baseUrl + 'pokemon/' + pokemon);
    }

}
