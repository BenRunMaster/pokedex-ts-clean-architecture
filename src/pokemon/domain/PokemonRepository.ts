import { Pokemon } from "./Pokemon";

export interface PokemonRepository {
    getPokemon(pokemon: number | string): Promise<Pokemon>
}