# Frontend Project

## Overview
This project is a frontend application that provides user registration, login, API key management, and country selection functionalities. It is structured to separate concerns between models, views, and routing.

## Folder Structure
```
frontend-project
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── models
│       │   └── UserModel.js
│       ├── views
│       │   ├── RegisterView.js
│       │   ├── LoginView.js
│       │   ├── APIKeyView.js
│       │   └── CountryView.js
│       └── router.js
├── index.html
├── package.json
└── README.md
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd frontend-project
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

## Usage
- Open `index.html` in your web browser to access the application.
- Use the registration view to create a new user account.
- Log in using the login view.
- Manage your API keys through the API key view.
- Select your country from the country selection view.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.