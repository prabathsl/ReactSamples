import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useInfiniteQuery, useMutation } from 'react-query';
import { Card, CardContent, CardMedia, Typography,Box,Icon, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

const fetchCharacters = async (page: number): Promise<Character[]> => {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  const data = await response.json();
  return data.results;
};


const App: React.FC = () => {
  const queryClient = new QueryClient();

  const fetchMoreCharacters = async (page: number, previousData: Character[]): Promise<Character[]> => {
    const newCharacters = await fetchCharacters(page);
    return [...previousData, ...newCharacters];
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useInfiniteQuery<
    Character[],
    Error
  >('characters', ({ pageParam = 1 }) => fetchMoreCharacters(pageParam, []), {
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) {
        return undefined; // Stop fetching more pages if the last page is empty
      }
      return lastPage.length / 20 + 1; // Calculate the next page number
    },
  });



  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading && !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message ?? 'An error occurred'}</div>;
  }

  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      {data && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.map((character) => (
                <Card key={character.id} sx={{ maxWidth: 300, marginBottom: 2,marginLeft:2, flex: '1 0 33%' }}>
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
                    <Box display="flex" alignItems="center" marginTop={1}>
                      {character.status === 'Alive' && (
                        <CheckCircleIcon sx={{ marginRight: 1, color: 'success.main' }} />
                      )}
                      {character.status === 'Dead' && (
                        <CancelIcon sx={{ marginRight: 1, color: 'error.main' }} />
                      )}
                      {character.status !== 'Alive' && character.status !== 'Dead' && (
                        <HelpOutlineIcon sx={{ marginRight: 1 }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {character.status} - {character.species}
                      </Typography>
                    </Box>
                    
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          ))}
          <div ref={loadMoreRef}></div>
        </div>
      )}
    </div>
  );
};


export default App;
