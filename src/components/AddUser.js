import React, { useState } from 'react'
import axios from 'axios'
import Loader from './Loader';
const AddUser = () => {
    const [pan, setPan] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [panLoader, setPanLoader] = useState(false)
    const [postalCodeLoader, setPostalCodeLoader] = useState(false)

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

    function verifyPostalCode(e) {
        const input = e.target.value;
        console.log(input);
        const currentDigit = input.charCodeAt(input.length - 1);
        if ((input == '') || (currentDigit >= 48 && currentDigit <= 57)) {
            setPostCode(input)
            if (input.length == 6) {
                setPostalCodeLoader(true)
                axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode: input }).then(
                    (res) => {
                        setCity(res.data.city[0].name);
                        setState(res.data.state[0].name)
                        setPostalCodeLoader(false)
                    }
                )
            }

        }
        else {
            setCity('');
            setState('')
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
    }

    return (
        <div className='d-flex justify-content-center m-2 p-3'>
            <form className='form' onSubmit={handleSubmit}>
                <div className='add-user d-flex flex-column gap-2'>
                    <div className='pan d-flex flex-column'>
                        <label>Enter PAN No.</label>
                        <div className='d-flex gap-2'>
                            <input type='text' required className='w-100' value={pan} maxLength='10' name='pan' onChange={(e) => { veifyPan(e) }} ></input>
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
                                <input type='text' required maxLength='10' value={mobileno} onChange={(e) => verifyMobileno(e)} name='mobileno'></input>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-2'>
                        <div className='address1 d-flex flex-column'>
                            <label>Enter address Line 1</label>
                            <input type='text' required value={address1} onChange={(e) => setAddress1(e.target.value)} name='address1'></input>
                        </div>
                        <div className='address2 d-flex flex-column'>
                            <label>Enter address Line 2</label>
                            <input type='text' value={address2} onChange={(e) => setAddress2(e.target.value)} name='address2'></input>
                        </div>
                    </div>
                    <div className='postcode d-flex flex-column'>
                        <label>Enter Postcode</label>
                        <div className='d-flex gap-2'>
                            <input type='text' required className='w-100' maxLength='6' value={postCode} onChange={(e) => verifyPostalCode(e)} name='postcode'></input>
                            {postalCodeLoader && <Loader />}
                        </div>
                    </div>
                    <div className='d-flex gap-2'>
                        <div className='state d-flex flex-column'>
                            <label>Enter State </label>
                            <input type='text' value={state} onChange={(e) => setState(e.target.value)} name='state'></input>
                        </div>
                        <div className='city d-flex flex-column'>
                            <label>Enter City</label>
                            <input type='text' value={city} onChange={(e) => setCity(e.target.value)} name='city'></input>
                        </div>
                    </div>
                    <div className='submit d-flex justify-content-center'>
                        <input type='submit' id='submit-btn' className='btn btn-primary disabled w-100' name='city'></input>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddUser
