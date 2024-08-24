# Hommie Assist: A Chatbot for Home Improvement related queries

## Objective
Develop a basic version of a chatbot designed for lead generation on home improvement websites. The chatbot will demonstrate the core functionalities required for capturing user information, providing service options, and guiding users towards their desired solutions.
## Basic Functionalities

### Welcome Message
- **Functionality**: Display a friendly greeting when a user lands on a page and offer assistance.
- **Example**: "Hi there! I'm here to help you connect with top-rated contractors. How can I assist you today?"

### Service Inquiry and Lead Capture
- **Functionality**: Ask the user what type of service they are looking for (e.g., landscaping, plumbing) and prompt them to provide basic contact details: Name, Email, and Phone Number.
- **Example**: "What type of service do you need? (e.g., landscaping, plumbing) Please provide your name and contact details so I can assist you better."

### Service Options and Action Selection
- **Functionality**: Present the user with three options for engaging with contractors:
  - **Fill in a Form**: Display a simple form where the user can select up to four contractors and submit their information.
  - **Call a Number**: Show clickable phone numbers for up to four contractors, enabling the user to call directly.
  - **Set an Appointment**: Allow users to select one or more contractors and schedule an appointment through the chatbot. Basic appointment scheduling can be simulated.
- **Example**: "Would you like to fill in a form, call a contractor, or set an appointment?"

### FAQ Handling
- **Functionality**: Provide answers to at least three common questions related to the services offered (e.g., pricing, availability, contractor ratings). Data for FAQs will be provided in a PDF and in json file as well, stored in vector stores like ChromaDB, with information retrieved using GPT-4o.
- **Example Query**: "What is the average cost of plumbing services? How do I know the contractors are reliable?"

## Technical Specifications

- **Backend**: Use Flask to handle API requests and manage the chatbot's logic.
- **Frontend**: Implement a simple chat interface using reactjs and material-UI, ensuring that the chatbot can be easily integrated into any website.
- **Database**: Use a lightweight database SQLite to store user details and service selections.

## Evaluation Criteria

- **Functionality**: The chatbot should perform most of the basic actions as described.
- **User Experience**: The chatbot should provide a smooth, engaging experience for the user with an eye-catching design.
- **Code Quality**: The code should be well-organized and easy to understand.
- **Scalability**: Considerations for scaling the chatbot should be demonstrated..

## Getting Started

1. **Clone the Repository**: `git clone <https://github.com/valor30/hommie-assist>`
2. **Install Dependencies**:
   - Navigate to the project directory.
   - Install all the necessary backend dependencies using `pip install -r requirements.txt`.
   - Run `npm install` for frontend dependencies.
   - Set up the backend dependencies according to the chosen framework (Flask).
3. **Run the Application**:
   - Start the backend server by typing `python app.py` in your terminal after directing to the backend folder.
   - Launch the frontend application by typing `npm start` in your terminal after directing to the frontend directory.
   - The backend port and frontend port should varies according to your port preferences.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The chatbot utilizes GPT-4o for natural language processing and ChromaDB for FAQ handling.
- Special thanks to the Jatin Sharma for resources provided for this assignment.
