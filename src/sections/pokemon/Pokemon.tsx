import { createPokemonService } from "../../pokemon/application/PokemonService";
import { ApiPokemonRepository } from "../../pokemon/infrastructure/ApiPokemonRepository"
import { useQuery } from "@tanstack/react-query";

const repository = ApiPokemonRepository();
const service = createPokemonService(repository)


export function Pokemon() {
    const pokemon = 5;
    const query = useQuery({
        queryKey: ['todos', pokemon],
        queryFn: ({ queryKey }) => service.getPokemon(queryKey[1]),
    })

    if (query.status === 'pending') {
        return <span>Loading...</span>
    }

    if (query.status === 'error') {
        return <span>Error: {query.error.message}</span>
    }

    console.log('From component ', query.data)
    return (
        <>
            <div>
                <p>{query.data.name}</p>
                <img src={query.data.spray} alt={query.data.name} />
            </div>
        </>
    )
}
