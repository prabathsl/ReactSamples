import React from 'react';
import { QueryClient, useQuery,QueryClientProvider } from 'react-query';
import logo from './logo.svg';
import './App.css';
import DisasterItem from './TaxData'

 const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <DisasterItem />
    </QueryClientProvider>
  )
}

export default App;
