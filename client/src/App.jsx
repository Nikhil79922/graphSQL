/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useQuery, gql } from '@apollo/client';

const query = gql`
query GettodosWithServer{
getTodo {
id
  title
  completed
  user {
    id
    name
  }
}
}
`

function App() {
  const { loading, error, data } = useQuery(query);

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error : {error.message}</h1>
  return (
    <div>
      <table>
        <tbody>
          {data.getTodo.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo?.user?.name || "No User"}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App
