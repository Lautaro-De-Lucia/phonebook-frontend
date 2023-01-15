import React from 'react';

const Person = ({key,name,number,deletePerson}) =>{
    return(
    <li>
    {name} {number} 
    <button onClick = {deletePerson}> {'delete'}</button>
    </li>)
}

export default Person
