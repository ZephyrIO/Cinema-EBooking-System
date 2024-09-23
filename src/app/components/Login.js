import './Login.css';

export default function Login () {
    return (
        <div className="login">
            <h2 className="login-title">Login</h2>
            <form>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <div className="button-group">
                    <button type="submit" className="login">Login</button>
                    <button type="button" className="register">Register</button>
                </div>

            </form>
        </div>
    )
}