import { PokemonRepository } from "../domain/PokemonRepository";

export const createPokemonService = (repository: PokemonRepository) => {
    return {
        getPokemon: (pokemon: number | string) => repository.getPokemon(pokemon),
    }
}