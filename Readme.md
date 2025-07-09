# <h1 align="center">CodeSandbox-Backend</h1>

CodeSandbox-Backend is a Node.js-based backend application designed to manage projects, containers, and terminal sessions. It provides APIs and WebSocket-based communication for creating, managing, and interacting with projects and their associated Docker containers.

## Features

- **Project Management**: Create and manage projects with unique IDs.
- **File System Operations**: Perform file and folder operations (create, read, write, delete, rename) via WebSocket events.
- **Docker Integration**: Automatically create and manage Docker containers for projects.
- **Terminal Support**: Establish WebSocket connections to interact with container terminals.
- **Real-Time File Watching**: Monitor project directories for changes using `chokidar`.

## Project Structure

The project is organized as follows:

```
.env
.gitignore
Dockerfile
package.json
Readme.md
projects/
src/
    index.js
    terminalApp.js
    config/
    containers/
    controllers/
    routes/
    service/
    socketHandlers/
    utils/
```

### Key Directories and Files

- **`src/index.js`**: Main entry point for the application. Sets up the Express server, WebSocket server, and API routes.
- **`src/terminalApp.js`**: Handles WebSocket connections for terminal interactions.
- **`src/routes/`**: Contains API route definitions.
- **`src/controllers/`**: Implements logic for handling API requests.
- **`src/service/`**: Contains business logic for project creation and management.
- **`src/containers/`**: Manages Docker container creation and terminal sessions.
- **`src/socketHandlers/`**: Handles WebSocket events for editor and terminal interactions.
- **`Dockerfile`**: Defines the Docker image used for project containers.

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **Docker**: Install Docker to enable container management.
- **Environment Variables**: Create a `.env` file with the following variables:
  - `PORT`: Port for the backend server (default: 3000).
  - `REACT_PROJECT_COMMAND`: Command to initialize a React project (e.g., `npm create vite@latest`).

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd codesandbox-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the Docker image:
   ```bash
   docker build -t sandbox .
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
### Run the Terminal Server separately
 ```bash
   npx nodemon src/terminalApp.js
   ```

## API Endpoints

### Base URL: `/api/v1`

- **`POST /projects`**: Create a new project.
- **`GET /projects/:projectId/tree`**: Fetch the directory tree of a project.



## WebSocket Events

### Editor Namespace (`/editor`)

- **`writeFile`**: Write data to a file.
- **`createFile`**: Create a new file.
- **`readFile`**: Read the contents of a file.
- **`deleteFile`**: Delete a file.
- **`createFolder`**: Create a new folder.
- **`deleteFolder`**: Delete a folder.
- **`renameFile`**: Rename a file.
- **`renameFolder`**: Rename a folder.
- **`getPort`**: Get the port of a container.

### Terminal Namespace (`/terminal`)

- Establishes a WebSocket connection to interact with the terminal of a Docker container.

## Steps to Turn Up Docker Container After Creating a Project

1. Build the Docker image:
   ```bash
   docker build -t sandbox .
   ```

2. The backend will automatically create and start a container for each project.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express**: Web framework for API development.
- **Socket.IO**: WebSocket library for real-time communication.
- **Docker**: Containerization platform.
- **Chokidar**: File watching library.
- **Dockerode**: Docker API client for Node.js.

---

# [Check Frontend Code](https://github.com/himanshuramteke/CodeSandbox-frontend)