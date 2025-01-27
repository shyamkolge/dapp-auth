import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Admin({ contract, account }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [contract]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const userCount = await contract.methods.getUserCount().call();
      const fetchedUsers = [];
      
      for (let i = 0; i < userCount; i++) {
        const user = await contract.methods.getUser(i).call({ from: account });
        fetchedUsers.push({
          username: user.username,
          passwordHash: user.passwordHash
        });
      }
      
      setUsers(fetchedUsers);
    } catch (error) {
      setError('Failed to fetch users: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>

      {isLoading && <p className="loading">Loading users...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="users-list">
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Password Hash</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td className="password-hash">{user.passwordHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Admin; 