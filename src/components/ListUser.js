import React, { useEffect, useState } from 'react'
import EditUser from './EditUser';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadAgain, setLoadAgain] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const tempUsers = [];
    // Fetching all Users Data Present in LocalStorage
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      tempUsers.push(JSON.parse(value));
    }
    setUsers(tempUsers)
    console.log(users);
  }, [showModel, selectedUser, loadAgain])

  function handleDelete(e, user) {
    e.preventDefault();
    Swal.fire({
      title: 'Do You Really Want to Delete',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        if (localStorage.getItem(user.pan)) {
          localStorage.removeItem(user.pan);
          setLoadAgain(!loadAgain)
        }
      }
    })
  }

  return (
    <div>
      <div className='users p-2 m-4'>
        {
          users.length > 0 ? (
            <table className='table table-bordered  w-100'>
              <thead >
                <tr className='text-center bg-info '>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Sr.No</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>PAN</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Name</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Email</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Mobile No</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Add Line 1</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Add Line 2</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>Postcode</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>State</th>
                  <th style={{ backgroundColor: '#FF9EAA' }}>City</th>
                  <th style={{ backgroundColor: '#FF9EAA' }} colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, srno) => (
                  <>
                    {user.address.map((item, index) => (
                      <tr className='text-center'>
                        {/* showing this one time only */}
                        {index === 0 && (
                          <>
                            <td rowSpan={user.address.length}>{srno + 1}</td>
                            <td rowSpan={user.address.length}><span style={{ backgroundColor: '#37B7C3', padding: '4px 8px' }}>{user.pan}</span></td>
                            <td rowSpan={user.address.length}>{user.fullname}</td>
                            <td rowSpan={user.address.length}>{user.email}</td>
                            <td rowSpan={user.address.length}>{user.mobileno}</td>
                          </>
                        )}
                        <td>{item.line1}</td>
                        <td>{item.line2}</td>
                        <td>{item.postCode}</td>
                        <td>{item.state}</td>
                        <td>{item.city}</td>
                        {index === 0 && (
                          <>
                            <td rowSpan={user.address.length} style={{ cursor: 'pointer' }} onClick={() => { setSelectedUser(user); setShowModel(true) }} data-toggle="modal" data-target="#exampleModalCenter">
                              <i className="bi bi-pencil text-info"></i>
                            </td>
                            <td rowSpan={user.address.length} style={{ cursor: 'pointer' }} onClick={(e) => { handleDelete(e, user) }}>
                              <i className="bi bi-trash text-danger"></i>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
              {showModel && <EditUser user={selectedUser} setShowModel={setShowModel} />}

            </table>
          ) : (<h1 className='text-center'>No User Found !!! Pls add user.
            <br>
            </br>
            <u className='text-info' style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Add User</u>
          </h1>)
        }
      </div>
    </div >
  )
}

export default ListUser
