# School Management App

A simple Next.js application with subdomain-based routing for managing school profiles.

## Features Implemented:

- Subdomain-based routing (e.g., school1.localhost:3000, school2.localhost:3000)
- School profile page showing basic information (name, description, contact details)
- Simple admin page to edit school information (protected by basic authentication)
- TypeScript implementation
- Responsive design (using Tailwind CSS)
- Basic testing (using Jest and @testing-library/react)
- Use Next.js App Router
- API routes for data operations (update)
- README with setup and running instructions
- List of features implemented
- Assumptions and limitations

## Setup and Running Instructions:

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd school-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    This will start the Next.js development server on `http://localhost:3000`.

4.  **Access the application:**

    - To view the school profiles, you need to access the application using subdomains. You can achieve this locally by modifying your system's hosts file.

      **For macOS/Linux:**
      Open your terminal and edit the `/etc/hosts` file:

      ```bash
      sudo nano /etc/hosts
      ```

      Add the following lines:

      ```
      127.0.0.1 school1.localhost
      127.0.0.1 school2.localhost
      ```

      Save the file and exit.

      **For Windows:**
      Open Notepad as Administrator and edit the `C:\Windows\System32\drivers\etc\hosts` file.
      Add the following lines:

      ```
      127.0.0.1 school1.localhost
      127.0.0.1 school2.localhost
      ```

      Save the file and exit.

    - Now you can access the school profiles in your browser at:

      - `http://school1.localhost:3000`
      - `http://school2.localhost:3000`

    - The admin page can be accessed at `http://localhost:3000/admin`. Use the credentials `username: admin`, `password: password` to log in.

5.  **Run tests:**
    ```bash
    npm run test
    # or
    yarn test
    # or
    pnpm test
    ```

## Assumptions and Limitations:

- **Basic Authentication:** The admin page uses a very basic, in-memory authentication mechanism for demonstration purposes. It is not secure for production environments.
- **In-Memory Data:** School data is stored in memory (in `src/data/schools.ts`). This means the data will be lost when the server restarts. In a real application, you would use a database to persist the data.
- **No Database Integration:** This example does not include integration with a database.
- **Limited Error Handling:** Error handling is basic and could be improved.
- **No Input Validation:** The admin form does not include comprehensive input validation.
- **No User Roles:** There are no different user roles implemented.

## Further Improvements:

- Implement a proper authentication system (e.g., using NextAuth.js).
- Integrate with a database (e.g., PostgreSQL, MongoDB).
- Add more comprehensive error handling and input validation.
- Implement user roles and permissions for the admin area.
- Add functionality to create and delete schools.
- Implement more robust testing.
- Improve the UI and user experience.
