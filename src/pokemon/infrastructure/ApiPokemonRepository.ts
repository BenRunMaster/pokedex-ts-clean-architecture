import api from '../../services/axiosConfig.ts'
import { Pokemon, PokemonEvol } from '../domain/Pokemon.ts';
import { PokemonRepository } from "../domain/PokemonRepository";

// ======================================================================
// ============ Services ================================================
// ======================================================================

/**
 * Get pokemon from pokeApi
 * @param pokemon 
 * @returns any[] 
 */
const fetchPokemon = async (pokemon: number | string): Promise<any> => {
    const data = await api.get(`/pokemon/${pokemon}`);
    return data;
}

/**
 * Get adapted result of "Move" or "Ability"
 * @param valuesData JSON with name and url to get the effect 
 * @param valType is "Move" or "Ability"
 * @returns JSON with the adapted data
 */
const fetchValues = async (valuesData: any, valType: string) => {
    // Usa Promise.all para ejecutar todas las peticiones en paralelo
    const values = await Promise.all(valuesData.map(async (item: any) => {
        const effect = await fetchDescription(item[valType].url);
        return {
            name: item[valType].name,
            effect
        };
    }));

    return values;
}

/**
 * Find and return description
 * @param dataItem url source
 * @returns Description
 */
const fetchDescription = async (dataItem: string): Promise<string> => {
    const { data } = await api.get(dataItem);
    const effectEntry = data.effect_entries.find((item: AbilityMove) => {
        return item.language.name == "en" && item.short_effect;
    });

    // Si no se encuentra un objeto válido, retornar un valor por defecto
    if (!effectEntry) {
        return "No description available";
    }

    const { short_effect } = effectEntry;
    return short_effect;
}

/**
 * Adapted pokemon chain evolution data
 * @param url url chain evolution
 * @returns PokemonEvol[] format
 */
const fetchEvol = async (url: string): Promise<any> => {
    const result = await api.get(url).then(async (data) => {
        const evolData = await api.get(data.data.evolution_chain.url)
        return evolData.data.chain
    });
    return await getEvolutions(result);
}

/**
 * Find and order the chain evolution
 * @param evolsData 
 * @returns PokemonEvol[] format
 */
const getEvolutions = async (evolsData: any) => {
    const evolChain: PokemonEvol[] = [];
    let contentData = evolsData;

    while (contentData) {
        const { data } = await fetchPokemon(contentData.species.name);
        evolChain.push({
            name: contentData.species.name,
            spray: data.sprites.front_default
        });
        contentData = contentData.evolves_to?.[0] || null;
    }
    return evolChain;
}
// ======================================================================
// ============ Formats  ================================================
// ======================================================================
interface Type {
    type: {
        name: string;
    };
}

interface Stat {
    base_stat: number,
    stat: { name: string }
}

interface AbilityMove {
    language: {
        name: string
    }
    short_effect: string
}



export const ApiPokemonRepository = (): PokemonRepository => {
    return {
        getPokemon: async (pokemon: number | string): Promise<Pokemon> => {
            const { data } = await fetchPokemon(pokemon);
            const abilitiesValues = await fetchValues(data.abilities, 'ability');
            const movesValues = await fetchValues(data.moves, 'move');
            const evolValues = await fetchEvol(data.species.url);

            const pokemonValues = {
                id: data.id,
                order: data.order,
                name: data.name,
                weight: data.weight,
                height: data.height,
                type: data.types.map(
                    (item: Type) => item.type.name
                ),
                spray: data.sprites.front_default,
                stat: data.stats.map(
                    (item: Stat) => ({
                        base_stat: item.base_stat,
                        name: item.stat.name
                    })
                ),
                ability: abilitiesValues,
                move: movesValues,
                evol: evolValues
            }


            return pokemonValues;
        }
    }
}