import './EditProfile.css';

export default function EditProfile() {
    return (
      <div className="editProfile">
        <h2 className="editProfileTitle">Edit Profile</h2>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
          />
          <div className="button">
            <button type="submit" className="saveChanges">Save Changes</button>
            <button type="button" className="cancelChanges">Cancel</button>
          </div>
        </form>
      </div>
    );
  }