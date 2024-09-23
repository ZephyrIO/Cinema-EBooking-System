import './Register.css'

export default function Register () {
    return (
        <div className="register">
            <h2 className="register-title">Register</h2>
            <form>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    placeholder="Phone # (1234567890)"
                    required
                />
                <select name="cardType" placeholder="Card Type">
                    <option value="">Select Card Type</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">American Express</option>
                </select>
                <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    pattern="[0-9]{16}"
                />
                <input
                    type="text"
                    name="expirationDate"
                    placeholder="Expiration Date (MM/YY)"
                />
                <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                />
                <input
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                />
                <div className="button-group">
                    <button type="submit" className="register">Register</button>
                    <button type="button" className="login">Login</button>
                </div>
            </form>
        </div>
    )
}