import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
};

type ApiResponse = {
  results: Character[];
};

const fetchCharacters = async (): Promise<Character[]> => {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const data: ApiResponse = await response.json();
  return data.results;
};

const App: React.FC = () => {
  const queryClient = new QueryClient();

  const { data, isLoading, error } = useQuery<Character[]>('characters', fetchCharacters);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
  }

  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      {data && (
        <ul>
          {data.map((character) => (
            <li key={character.id}>
              {character.name} - {character.status} - {character.species}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;