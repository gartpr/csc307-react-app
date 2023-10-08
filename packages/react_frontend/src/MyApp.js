import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter (index, id) {
	  const updated = characters.filter((character, i) => {
	        return i !== index
	  });
	  setCharacters(updated);
    // fetch method to call delete in backend, using ID
    fetch(`http://localhost:8000/users/${id}`, {
      method: 'DELETE',
    })
    // Potential errors or success, sends to console
    .then((res) => {
      if (res.status === 204) {
        // Successful deletion on the backend
        console.log('User deleted successfully.');
      } else if (res.status === 404) {
        // User not found on the backend
        console.log('User not found.');
      } else {
        // Handle other error cases
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
	}
  
  function updateList(person) { 
    postUser(person)
    // check return code
      .then(res => {if (res.status === 201) { return res.json()}
                      else {throw new Error(`Unexpected response status: ${res.status}`)
                    }
                  })
      .then((person) => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      })
  }

  //linking backend to frontend
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
    
  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}

export default MyApp;