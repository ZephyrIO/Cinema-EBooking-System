import './EditProfile.css';

export default function EditProfile() {
    return (
      <div className="edit-profile">
        <h2 className="edit-profile-title">Edit Profile</h2>
        <form>
          <div className="personal-info">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="payment-info">
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
            />
            <input
              type="text"
              name="expirationDate"
              placeholder="Expiration Date (MM/YY)"
            />
          </div>
          <div className="billing-address">
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
          </div>
          <div className="button-group">
            <button type="submit" className="save">Save Changes</button>
            <button type="button" className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    );
  }