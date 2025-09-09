import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubAdminLoginForm = ({ onLogin }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('https://quickcabpune.com/dev/api/sub-admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            })
            const json = await response.json();
            if (json.status === 1) {
                alert("Login successful");
                localStorage.setItem('token', json.token)
                localStorage.setItem('role', 'sub-admin')
                navigate('/sub-admin/vendor-details', { replace: true })
            } else {
                console.log(json);

                alert(json.message);
            }
        } catch (error) {
            console.log(error)
            alert("Login failed");
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <h2>Sub-Admin Login</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phone}
                        maxLength={13}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="eg: 9876543210"
                        required disabled={loading}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        required disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>Login</button>
            </form>
        </>
    );
};

export default SubAdminLoginForm;
