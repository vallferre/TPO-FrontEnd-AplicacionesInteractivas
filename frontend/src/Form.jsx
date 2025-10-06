import App from './App.jsx'
import { use, useState } from 'react' //así se importa componentes

const Form = () => {
    const[apps, setApps] = useState([]); //hook de estado
    const[app, setApp] = useState('');

    const handleChange = (e) => {setApp(e.target.value)}

    const handleClick = () => {
        if(app.trim() === ''){
            alert('El campo no puede estar vacío');
            return;
        }
        setApps([...apps, {app}]);
    }

    const deleteApp = (index)=>{
        const newApps = [...apps];
        newApps.splice(index, 1);
    }

    return (
        <>
        <form onSubmit={(e)=> e.preventDefault()}>
            <lable>pone algo</lable><br />
            <input type="text" name="app" onChange={handleChange}/>
            <button onClick = {handleClick}>Agregar</button>
        </form>
        {apps.map((value, index) => 
        <App app={value.app}/>
        )}
        </>
    );
};
export default Form;