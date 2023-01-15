import React from 'react';

const Filter = (props) => (<div>Filter: <input value={props.filter} onChange ={props.handler}/> </div>)

export default Filter
