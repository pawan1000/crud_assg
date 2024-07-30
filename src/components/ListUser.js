import React, { useEffect, useState } from 'react'
import EditUser from './EditUser';
import { useNavigate } from 'react-router-dom';
const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadAgain,setLoadAgain]=useState(false);
  let navigate=useNavigate();

  useEffect(() => {
    const tempUsers = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      tempUsers.push(JSON.parse(value));
    }
    setUsers(tempUsers)
    console.log(users);
  }, [showModel,selectedUser,loadAgain])

  function handleDelete(e,user) {
    e.preventDefault(); // Prevent default behavior

    let confirmDelete = window.confirm('Do you want to delete?');

    if (confirmDelete) {
        // Check if the user key exists in localStorage
        if (localStorage.getItem(user.pan)) {
            localStorage.removeItem(user.pan);
            console.log(`Deleted user with pan: ${user.pan}`);
            setLoadAgain(!loadAgain)
        } else {
            console.log(`No user found with pan: ${user.pan}`);
        }
    }
}


  return (
    <div>
      <div className='users p-2 m-4'>
        {
          users.length > 0 ? (
            <table className='table-bordered  w-100'>
              <thead >
                <tr className='text-center bg-info'>
                  <th>Sr.No</th>
                  <th>PAN</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile No</th>
                  <th>Add Line 1</th>
                  <th>Add Line 2</th>
                  <th>Postcode</th>
                  <th>State</th>
                  <th>City</th>
                  <th colSpan={2}>Actions</th>
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
                            <td rowSpan={user.address.length}>{user.pan}</td>
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
                              <i className="bi bi-pencil"></i>
                            </td>
                            <td rowSpan={user.address.length} style={{ cursor: 'pointer' }} onClick={(e) => {  handleDelete(e,user) }}>
                              <i className="bi bi-trash"></i>
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
            <u className='text-info' style={{cursor:'pointer'}} onClick={()=>navigate('/')}>Add User</u>
          </h1>)
        }
      </div>
    </div >
  )
}

export default ListUser
