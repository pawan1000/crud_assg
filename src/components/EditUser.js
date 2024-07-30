import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EditUser({ user, setShowModel }) {
    const [show, setShow] = useState(true);
    const handleClose = () => { setShow(false); setShowModel(false) };
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    function handleUpdate(e) {
        e.preventDefault();
        setShowModel(false);
        console.log("Updated user data:", userData);
        localStorage.setItem(userData.pan, JSON.stringify(userData))
    }

    function handleChange(e, key, index) {
        const { name, value } = e.target;
        if (key === 'address') {
            const updatedAddresses = [...userData[key]];
            updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
            setUserData({ ...userData, [key]: updatedAddresses });
        } else {
            setUserData({ ...userData, [key]: value });
        }
    }

    function deleteAddress(e, index) {
        const deleteConfirm = window.confirm('Do You Really Want to Delete')
        if (deleteConfirm) {
            const updatedAddresses = [...userData['address']]
            const filterAddress = updatedAddresses.filter((address, i) => i != index)
            setUserData({ ...userData, 'address': filterAddress })  
        }
    }

    return (
        <>
            {user && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div className='d-flex flex-column gap-2'>
                                {Object.keys(userData).map((key) => {
                                    if (key === 'address') {
                                        return userData[key].map((address, idx) => (
                                            <div key={idx}>
                                                <h5 className='text-center'>Address {idx + 1}</h5>
                                                {idx != 0 && <div className='btn btn-danger' onClick={(e) => deleteAddress(e, idx)}><i class="bi bi-trash"></i> </div>}
                                                {Object.keys(address).map((item) => (
                                                    <div className='d-flex flex-column' key={item}>
                                                        <label>{item}</label>
                                                        <input type='text' required={item != 'line2'} value={address[item]} name={item} onChange={(e) => handleChange(e, 'address', idx)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ));
                                    } else {
                                        return (
                                            <div className='d-flex flex-column' key={key}>
                                                <label>{key}</label>
                                                <input type='text' readOnly={key === 'pan'} required name={key} value={userData[key]} onChange={(e) => handleChange(e, key)}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                                <div>
                                    <Button type='submit' className='btn btn-info w-100'>Update</Button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
}

export default EditUser;