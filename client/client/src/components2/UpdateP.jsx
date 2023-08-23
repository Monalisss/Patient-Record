import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router'
import "./Comp2.css"
import PatientApi from '../api/PatientApi'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateP = () => {
    const {id_pacient} =  useParams()
    let navigate = useNavigate()

    const [nume, setNume ]= useState ("");
    const [prenume, setPrenume ]= useState ("");
    const [telefon, setTelefon ]= useState ("");
    const [data_nasterii, setData ]= useState(''); 
    const [email, setEmail ]= useState ('');
    const [sex, setSex ]= useState ('sex');
    const [alergii, setAlergii ]= useState ('');
    const [medicamente, setMedicamente ]= useState ('');
    const [istoric, setIstoric ]= useState ('');

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await PatientApi.get(`/${id_pacient}`);
            console.log(response.data.data);
            setNume(response.data.data.pacient.nume)
            setPrenume(response.data.data.pacient.prenume)
            setTelefon(response.data.data.pacient.telefon)
            setData(response.data.data.pacient.data_nasterii)
            setEmail(response.data.data.pacient.email)
            setSex(response.data.data.pacient.sex)
            setAlergii(response.data.data.pacient.alergii)
            setMedicamente(response.data.data.pacient.medicamente)
            setIstoric(response.data.data.pacient.istoric_medical)
            } 
            
            catch (error) {
            console.error(error);
            }
        };

        fetchData();
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault()

        if (!/^[A-Za-z]+$/.test(nume) || !/^[A-Za-z]+$/.test(prenume)) {
                toast.error('Numele și prenumele trebuie să conțină doar litere.');
                return;
            }
            try{
                await PatientApi.put(`/${id_pacient}` , {
                    nume,
                    prenume,
                    telefon,
                    data_nasterii,
                    email,
                    sex,
                    alergii,
                    medicamente,
                    istoric_medical:istoric,
                });
                navigate("/");
            } catch (err) {
                console.log(err);
            }
        }
    return (
    <div className='table2'>
        <h1 className='text-center'>Update Formular</h1>
        <form>

        <div className="form-group">
    <label for="nume">Nume</label>
    <input value={nume} onChange={e => setNume(e.target.value)} type="text" className="form-control" id="nume" placeholder="Nume"/>
    </div>

        <div className="form-group">
    <label for="prenume">Prenume</label>
    <input value={prenume} onChange={e => setPrenume(e.target.value)} 
    type="text" className="form-control" id="prenume" placeholder="Prenume"/>
    </div>

    <div className="form-group">
    <label for="telefon">Telefon</label>
    <input value={telefon} onChange={e => setTelefon(e.target.value)} 
    type="number" className="form-control" id="telefon" placeholder="Telefon"/>
    </div>

    <div className="form-group">
    <label for="data_nasterii">Data_Nasterii</label>
    <input value={data_nasterii} onChange={e => setData(e.target.value)} 
    type="date" className="form-control" id="data_nasterii" placeholder="data_nasterii"/>
    </div>

    <div className="form-group">
    <label for="email">Email address</label>
    <input value={email} onChange={e => setEmail(e.target.value)} 
    type="email" className="form-control" id="email" placeholder="name@example.com"/>
    </div>

    <div class="form-group">
    <label for="sex">Sex</label>
    <select value={sex} onChange={e => setSex(e.target.value)} 
    className="form-control" id="sex">

        <option>F</option>
        <option>M</option>
    </select>
    </div>

    <div class="form-group">
    <label for="alergii">Alergii</label>
    <textarea value={alergii} onChange={e => setAlergii(e.target.value)} class="form-control" id="ealergii" rows="3"></textarea>
    </div>

    <div class="form-group">
    <label for="medicamente">Medicamente</label>
    <textarea value={medicamente} onChange={e => setMedicamente(e.target.value)} class="form-control" id="medicamente" rows="3"></textarea>
    </div>

    <div class="form-group">
    <label for="istoric">Istoric_Medical</label>
    <textarea value={istoric} onChange={e => setIstoric(e.target.value)} class="form-control" id="istoric" rows="3"></textarea>
    </div>

    <button onClick={handleSubmit} type="button" class="btn btn-primary btn-lg btn-block">Submit</button>
</form>

    </div>
    )
}
export default UpdateP


