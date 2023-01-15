import React from 'react';

const PersonsForm = (props) => (
    <form onSubmit={props.handler}>
    <div>Name: <input value = {props.name} onChange={props.nameHandler}/></div>
    <div>Phone: <input value = {props.phone} onChange={props.phoneHandler}/></div>
    <div><button type="submit">add</button></div>
    </form>
)

export default PersonsForm
