# Project Setup

This project is designed to run using Docker for easy deployment and management. Follow the steps below to set up and run the project.

## Prerequisites

- Ensure you have Docker and Docker Compose installed on your machine.
- Obtain a TMDB API key from [The Movie Database](https://www.themoviedb.org/documentation/api).

## Setup Instructions

1. **Clone the Repository**  
   Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Create the `.env` File**  
   Navigate to the backend directory and create a `.env` file. Add the following content:
   ```env
   TMDB_API_KEY=<your-tmdb-api-key>
   ```
   Replace `<your-tmdb-api-key>` with your actual TMDB API key.

3. **Build and Run the Docker Containers**  
   Use Docker Compose to build and start the containers:
   ```bash
   docker-compose up --build
   ```
   This will build the images and start the services defined in the `docker-compose.yml` file.

4. **Access the Application**  
   Once the containers are running, you can access the application:
   - Frontend: `http://localhost:<frontend-port>`
   - Backend: `http://localhost:<backend-port>`

## Notes

- Ensure the ports specified in the `docker-compose.yml` file are not in use by other applications.
- If you encounter any issues, check the logs using:
  ```bash
  docker-compose logs
  ```

## License

This project is licensed under the [MIT License](LICENSE).