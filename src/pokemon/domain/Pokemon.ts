
export type PokemonStat = {
    base_stat: number,
    name: string
}

export type PokemonAbility = {
    name: string,
    effect:string
}

export type PokemonMove = {
    name: string,
    effect:string
}

export type PokemonEvol = {
    name: string,
    spray:string
}



export interface Pokemon {
    id: number;
    order: number;
    name: string;
    weight:number;
    height:number;
    type: string[];
    spray: string;
    stat:PokemonStat[];
    ability:PokemonAbility[];
    move:PokemonMove[];
    evol:PokemonEvol[];
}

export interface AllPokemon{
    order:number;
    spray:string;
    name:string;
    type: string[];
}