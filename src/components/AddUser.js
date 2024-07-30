import React, { useState } from 'react'
import axios from 'axios'
import Loader from './Loader';
import { useNavigate } from 'react-router-dom'
const AddUser = () => {
    const [pan, setPan] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [state, setState] = useState('');
    const [states, setStates] = useState([]);
    const [panLoader, setPanLoader] = useState(false)
    const [postalCodeLoader, setPostalCodeLoader] = useState(false)
    const navigate = useNavigate()
    const [address, setAddress] = useState([{ line1: '', line2: '', postCode: '', city: '', state: '', postalCodeLoader: false }])
    function veifyPan(e) {
        const input = e.target.value
        console.log(input);
        setPan(input)
        if (input.length == 10) {
            //first five char needs to be uppercase alphabets
            for (let i = 0; i < 5; i++) {
                if (!(input[i] >= 'A' && input[i] <= 'Z')) {
                    return;
                }
            }
            //next four needs to be digit 
            for (let i = 5; i < 9; i++) {
                if (!(input[i] >= 0 && input[i] <= 9)) {
                    return;
                }
            }
            //last needs to be uppercase alphabet
            if (!(input[9] >= 'A' && input[9] <= 'Z')) {
                return;
            }
            //PAN is verified
            setPanLoader(true)
            axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: input }).then(
                (res) => {
                    if (res.data.fullName) {
                        setFullName(res.data.fullName)
                        document.getElementById('submit-btn').classList.remove('disabled')

                    }
                    setPanLoader(false)
                }
            )
        }
        //Empty full name when PAN is not filled or it is wrong
        setFullName('')
    }

    function verifyMobileno(e) {
        const input = e.target.value;
        console.log(input);

        const currentDigit = input.charCodeAt(input.length - 1);
        console.log(currentDigit);
        if (currentDigit >= 48 && currentDigit <= 57) {
            setMobileno(input)
        }
        if (input.length == 0) {
            setMobileno('')
        }

    }

    function verifyPostCode(e, counter) {
        const input = e.target.value;
        console.log(input);
        const currentDigit = input.charCodeAt(input.length - 1);
        if ((input == '') || (currentDigit >= 48 && currentDigit <= 57)) {
            let newAddress = address.map((address, i) =>
                i === counter ? { ...address, postCode: input } : address
            );
            setAddress(newAddress);
            if (input.length == 6) {
                newAddress[counter].postalCodeLoader = true;
                axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode: input }).then(
                    (res) => {
                        console.log(res.data);
                        if (res.data.city[0].name) {
                            newAddress[counter].cities = res.data.city;
                            newAddress[counter].city = res.data.city[0].name

                        }
                        if (res.data.state[0].name) {
                            newAddress[counter].states = res.data.state;
                            newAddress[counter].state = res.data.state[0].name
                        }
                        newAddress[counter].postalCodeLoader = false;
                        setAddress([...newAddress]);
                    }
                )
            }
            else {
                newAddress[counter].cities = [];
                newAddress[counter].states = [];
                setAddress(newAddress);
            }
        }

    }

    function handleSubmit(e) {
        e.preventDefault()
        const formDataObj = {
            "pan": pan, "fullname": fullName, "email": email, "mobileno": mobileno, "address": address.map((address) => (
                { "line1": address.line1, "line2": address.line2, "postCode": address.postCode, "city": address.city, "state": address.state }
            ))
        }
        const data = JSON.stringify(formDataObj);
        console.table(formDataObj)
        // if user exisit it will update else it will create new entry
        localStorage.setItem(pan, data);
        navigate('/users')

    }

    function addAddress(e) {
        setAddress([...address, { line1: '', line2: '', postCode: '', city: '', state: '', postalCodeLoader: false }])
    }

    function handleAddress(e, counter) {
        const name = e.target.name;
        const value = e.target.value;
        const newAddress = address.map((address, i) =>
            i === counter ? { ...address, [name]: value } : address
        );
        setAddress(newAddress);

    }
    return (
        <div className='d-flex justify-content-center m-2 p-3'>
            <form className='form' id='form-basicDetails' onSubmit={handleSubmit}>
                <div className='add-user d-flex flex-column gap-2'>
                    <div className='pan d-flex flex-column'>
                        <label>Enter PAN No.</label>
                        <div className='d-flex gap-2'>
                            <input type='text' required className='w-100' value={pan} minLength='10' maxLength='10' name='pan' onChange={(e) => { veifyPan(e) }} ></input>
                            {panLoader && <Loader />}
                        </div>
                    </div>
                    <div className='fullname d-flex flex-column'>
                        <label>Enter your full name</label>
                        <input type='text' required maxLength='140' value={fullName} onChange={(e) => setFullName(e.target.value)} name='fullname'></input>
                    </div>
                    <div className='d-flex gap-2'>
                        <div className='email d-flex flex-column'>
                            <label>Enter Email</label>
                            <input type='email' required maxLength='255' value={email} onChange={(e) => setEmail(e.target.value)} name='email'></input>
                        </div>
                        <div className='mobileno d-flex flex-column'>
                            <label>Enter Mobile No.</label>
                            <div className='border'>
                                <span className=''>+91</span>
                                <input type='text' required minLength='10' maxLength='10' value={mobileno} onChange={(e) => verifyMobileno(e)} name='mobileno'></input>
                            </div>
                        </div>
                    </div>
                    <div className='address d-flex flex-column' id='address'>
                        {
                            address && (
                                address.map((addressNo, index) => {
                                    let counter = index;
                                    return (
                                        <div className='address d-flex flex-column  p-2 ' id={`address${counter}`}>
                                            <div className='d-flex gap-2'>
                                                <div className='line1 d-flex flex-column w-100'>
                                                    <label>Enter address Line 1</label>
                                                    <input type='text' required value={addressNo.line1} onChange={(e) => handleAddress(e, counter)} name={`line1`}></input>
                                                </div>
                                                <div className='line2 d-flex flex-column'>
                                                    <label>Enter address Line 2</label>
                                                    <input type='text' value={addressNo.line2} onChange={(e) => handleAddress(e, counter)} name={`line2`}></input>
                                                </div>
                                            </div>
                                            <div className='postcode d-flex flex-column'>
                                                <label>Enter Postcode</label>
                                                <div className='d-flex gap-2'>
                                                    <input type='text' required className='w-100' onChange={(e) => verifyPostCode(e, counter)} minLength='6' maxLength='6' value={addressNo.postCode} name={`postCode`}></input>
                                                    {addressNo.postalCodeLoader && <Loader />}
                                                </div>
                                            </div>
                                            <div className='d-flex gap-2'>
                                                <div className='state d-flex flex-column w-100'>
                                                    <label>Enter State </label>
                                                    <select value={addressNo.state} onChange={(e) => handleAddress(e, counter)} name={`state`}>
                                                        {addressNo.states && addressNo.states.map((item) => {
                                                            return <option value={item.name}>{item.name}</option>
                                                        })}
                                                    </select>
                                                </div>
                                                <div className='city d-flex flex-column w-100'>
                                                    <label>Enter City</label>
                                                    <select value={addressNo.city} onChange={(e) => handleAddress(e, counter)} name={`city`}>
                                                        {addressNo.cities && addressNo.cities.map((item) => {
                                                            return <option value={item.name}>{item.name}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <hr></hr>
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                    {address.length < 10 &&
                        <div className='addAddress'>
                            <div className='btn btn-info' onClick={(e) => addAddress(e)}>Add Another Address</div>
                        </div>
                    }
                    <div className='submit d-flex justify-content-between gap-3 mt-4'>
                        <input type='submit' id='submit-btn' className='btn btn-primary disabled w-100'></input>
                        <div className=' btn btn-info w-100' onClick={()=>navigate('/users')}> View Users</div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddUser
