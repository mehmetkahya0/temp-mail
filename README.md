# TempMail V2


![temp](https://github.com/user-attachments/assets/ff3789d8-fd7b-4783-a892-a0a32c7a664d)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

TempMail V2 is a secure and user-friendly temporary email service that allows users to generate disposable email addresses. Protect your inbox from spam and unwanted emails with our fast and reliable temporary email solution.

![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Fmehmetkahya0%2Ftemp-mail&label=VISITORS&labelColor=%23d9e3f0&countColor=%23263759)
- (28 august 2024 - now)




## Table of Contents
- [Star History](#star-history)
- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Description](#description)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)




## Star History

<a href="https://star-history.com/#mehmetkahya0/temp-mail&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mehmetkahya0/temp-mail&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mehmetkahya0/temp-mail&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mehmetkahya0/temp-mail&type=Date" />
 </picture>
</a>


## Features

- **Generate Disposable Emails:** Create temporary email addresses instantly.
- **Email Management:** View, search, and delete received emails.
- **Auto-Refresh:** Automatically refresh the inbox at set intervals.
- **Theme Switcher:** Toggle between light and dark modes for a personalized experience.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **User Feedback:** Rate the UI and provide feedback through embedded polls.
- **Secure Operations:** Utilizes Guerrilla Mail API for backend operations.

## Demo

Experience TempMail V2 in action by visiting the [Live Demo](https://mehmetkahya0.github.io/temp-mail/).

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (with custom theming)
  - JavaScript (ES6 Modules)
  - Font Awesome for icons

- **APIs:**
  - [Guerrilla Mail API](https://www.guerrillamail.com/)

## Installation

To set up TempMail V2 locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mehmetkahya0/temp-mail.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd temp-mail
   ```

3. **Install Dependencies:**

   TempMail V2 is a frontend-only project and does not require any backend setup. Ensure you have a web server to serve the files. You can use [Live Server](https://github.com/tapio/live-server) or any similar tool.

   If you have Node.js installed, you can install Live Server globally:

   ```bash
   npm install -g live-server
   ```

4. **Start the Server:**

   ```bash
   live-server
   ```

5. **Access the Application:**

   Open your browser and navigate to `http://127.0.0.1:8080` or the URL provided by Live Server.

## Usage

1. **Generate a New Email Address:**

   - Click on the "New Address" button to generate a new temporary email address.
   - The generated email will appear in the input field. You can copy it using the copy button next to the field.

2. **View Emails:**

   - Click on the "Load Mail" button to fetch and display received emails.
   - Use the search bar to filter emails based on keywords.

3. **Manage Emails:**

   - **View Email:** Click the eye icon to view the full content of an email.
   - **Delete Email:** Click the trash icon to delete an email from your inbox.

4. **Auto-Refresh:**

   - Enable the "Auto refresh" option to automatically refresh the inbox at your preferred interval (10s, 30s, 1m).

5. **Theme Switching:**

   - Use the theme toggle switch in the top-right corner to switch between light and dark modes. Your preference will be saved for future visits.

6. **Feedback:**

   - Upon launching the application, you'll receive an update notification prompting you to rate the new UI. Provide your feedback through the embedded poll.

## Project Structure
temp-mail/
├── css/
│ └── style.css
├── js/
│ ├── api.js
│ ├── config.js
│ └── theme.js
├── images/
│ ├── temp-mail-og-image.png
│ ├── temp-mail-twitter-image.png
│ └── temp-mail-icon.png
├── privacy/
│ └── privacy.html
├── index.html
└── README.md



### Description

- **index.html:**  
  The main HTML file that structures the application's user interface.

- **css/style.css:**  
  Contains all the styling for the application, including theming and responsive design.

- **js/api.js:**  
  Handles all API interactions with Guerrilla Mail, manages application state, and updates the DOM accordingly.

- **js/config.js:**  
  Stores configuration settings and constants used across the application, ensuring easy maintenance and scalability.

- **js/theme.js:**  
  Manages theme switching functionality, allowing users to toggle between light and dark modes while persisting their preferences.

- **images/:**  
  Directory containing all image assets used in the application.
  - **temp-mail-og-image.png:**  
    Open Graph image for social media sharing.
  - **temp-mail-twitter-image.png:**  
    Twitter-specific image asset.
  - **temp-mail-icon.png:**  
    Icon used throughout the application.

- **privacy/privacy.html:**  
  Contains the Privacy Policy of the application, outlining how user data is handled and ensuring transparency.

- **README.md:**  
  The project's README file, providing an overview, installation instructions, usage guidelines, and other essential information.




### Customization

- **API_BASE:** Change this if you intend to use a different API provider.
- **DOMAINS:** Add or remove domains as per your requirements.
- **UI Colors and Themes:** Modify CSS variables in `css/style.css` to customize the look and feel.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository:**

   Click on the "Fork" button at the top-right corner of the repository page.

2. **Clone the Forked Repository:**

   ```bash
   git clone https://github.com/mehmetkahya0/temp-mail.git
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes:**

   Implement your feature or fix the bug.

5. **Commit Your Changes:**

   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```

6. **Push to Your Fork:**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request:**

   Navigate to the original repository and click on "Compare & pull request."

## License

This project is licensed under the [MIT License](LICENSE).

**Important:** You can use this project for your own purposes but you can't use it for commercial purposes.

## Author

**Mehmet Kahya**  
[GitHub](https://github.com/mehmetkahya0) | [LinkedIn](https://linkedin.com/in/mehmetkahya0) | [Email](mailto:mehmetkahyakas5@gmail.com)

## Acknowledgments

- [Guerrilla Mail](https://www.guerrillamail.com/) for providing the robust API used in this project.
- Font Awesome for the beautiful icons.
- All contributors who helped in improving the project.

---

> **⚠️ Disclaimer:** This project is purely for educational purposes. We do not allow illegal activities to be performed using this project and are not responsible for any incidents that may occur. Use it legally and responsibly.
