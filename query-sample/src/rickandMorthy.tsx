import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

type ApiResponse = {
    results: Character[];
  };
  
  const fetchCharacters = async (): Promise<Character[]> => {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data: ApiResponse = await response.json();
    return data.results;
  };
  
const fetchCharacter = async (characterId: number): Promise<Character> => {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${characterId}`);
  const data: Character = await response.json();
  return data;
};

const createCharacter = async (): Promise<Character> => {
  const newCharacterId = 2; // Provide the ID of the character you want to fetch
  return fetchCharacter(newCharacterId);
};

const App: React.FC = () => {
  const queryClient = new QueryClient();

  const { data, isLoading, error } = useQuery<Character[]>('characters', fetchCharacters);

  const mutation = useMutation(createCharacter, {
    onSuccess: (newCharacter) => {
        //      queryClient.invalidateQueries('characters'); // Trigger a refetch of the characters query

      queryClient.setQueryData('characters', (oldCharacters?: Character[]) => {
        return oldCharacters ? [...oldCharacters, newCharacter] : [newCharacter];
      });
    },
  });

  const handleAddCharacter = () => {
    mutation.mutate();
  };

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
        <div>
          {data.map((character) => (
            <Card key={character.id} sx={{ maxWidth: 300, marginBottom: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={character.image}
                alt={character.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {character.status} - {character.species}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


export default App;