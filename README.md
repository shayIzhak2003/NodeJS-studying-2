# Node.js Template for CRUD Operations

This is a simple Node.js template with built-in CRUD (Create, Read, Update, Delete) operations. You can freely use it for your project.

## Features:
- **GET**: Retrieve data
- **POST**: Add new data
- **PUT**: Update existing data
- **DELETE**: Remove data

## How to Use:

1. **Install Dependencies**:  
Run the following command in your terminal to install the required `node_modules`:
npm i

2. **Start the Server**:
After installing dependencies, start the server by running:
npm start
3. **Note for PowerShell Users**:
If you encounter issues running commands in PowerShell:

Look for the + icon at the bottom of your terminal window.
Click it to open the terminal options menu.
Switch to Command Prompt (cmd) and try running the commands again

4. **Testing the API**:
Use tool like Postman to send requests to the server.
If you're working on a frontend, use fetch or any HTTP client (like Axios) to connect to the server.

5. **API Endpoints in Postman**:
- **GET**: Send a GET request to `http://localhost:4851/api/test-get
- **POST**: Send a POST request to `http://localhost:4851/api/test-post
- **PUT**: Send a PUT request to `http://localhost:4851/api/test-put/:id
- **DELETE**: Send a DELETE request to `http://localhost:4851/api/test-delete/:id

**Note**: When you see :id in the URL, replace it with the actual ID (like 1, 2, etc.) to update or delete a specific name.

**Changing the Port**
If you change the port in the server configuration, make sure to update the URL in the Postman requests as well:

Example: http://localhost:(YourPort)/api/test-get
