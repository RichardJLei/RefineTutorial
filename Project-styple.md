# Project Style Document v20250125

## 1. DRY (Don't Repeat Yourself)

- **Reuse** existing services/modules whenever possible.
- **Notify** if unsure whether a service is available.
- **Create new files only when:**
  - The required business logic is new.
  - Coordinating with multiple existing modules.
  - Using abstractions for shared/re-usable business logic.

## 2. Documentation Standards

- **Docstrings:** Include docstrings for all functions, classes, and modules.s
- **README Files:** Provide `README.md` files in major directories explaining their purpose and usage.
- **API Documentation:** Use **Swagger** for documenting FastAPI REST API endpoints.
- **Code Comments:** Add meaningful inline comments for complex logic or important sections of the code.

## 3. API Interaction Standards

- **HTTP Client:** Use **Axios** consistently for HTTP requests across the frontend.
- **Error Handling:** Implement standardized error handling mechanisms across all API calls.
- **Request Abstraction:** Abstract API calls into dedicated service modules (e.g., `userService.ts`).
- **Authentication Headers:** Automatically include authentication tokens (e.g., JWT) in API request headers.

## 4. Backend Technology Stack

- **Database:** MongoDB (hosted on Singapore and Google Cloud).
- **Framework:** FastAPI.

### Backend Guidelines

- **API Structure:**
  - Organize APIs using FastAPI routers within the `api/` directory.
- **Models:**
  - Define MongoDB models using ODM frameworks like **Motor** within the `models/` directory.
- **Services:**
  - Encapsulate business logic within service modules in the `services/` directory.
- **Configuration:**
  - Use environment variables for configuration settings.
  - Store configuration files in the `config/` directory.
- **Dockerization:**
  - Include a `Dockerfile` for containerizing the backend application.
- **Testing:**
  - Write unit and integration tests using frameworks like **pytest**.
  - Place tests in the `tests/` directory, mirroring the application structure.

## 5. Frontend Technology Stack

- **Framework:** React Admin.
- **UI Libraries:** Shadcn/UI and Tailwind CSS.
- **State Management:** Choose a state management library (e.g., Redux, Zustand).
- **Authentication & Storage:** Firebase Auth and Filebase Storage.

### Frontend Guidelines

- **Component Structure:**
  - Organize React components in the `components/` directory.
  - Place React Admin-specific components in the `admin/` directory.
- **Styling:**
  - Utilize Tailwind CSS for utility-first styling.
  - Use Shadcn/UI components for consistent UI elements.
- **State Management:**
  - Implement user state management in the `state/` directory.
  - Ensure all state interactions are asynchronous and follow best practices.
- **API Interactions:**
  - Abstract API calls into service modules within the `services/` directory.
  - Use **Axios** or **Fetch API** consistently for HTTP requests.
- **Authentication:**
  - Integrate Firebase Auth for handling user authentication.
  - Manage authenticated states and protect routes accordingly.
- **File Storage:**
  - Utilize Filebase Storage for handling file uploads and retrievals.
- **Dockerization:**
  - Include a `Dockerfile` for containerizing the frontend application.
- **Testing:**
  - Use **Jest** and **React Testing Library** for writing tests.
  - Place tests in the `tests/` directory, alongside corresponding modules.

## 6. Frontend and Backend Synchronization

- **Asynchronous Communication:** All frontend and backend API calls and database interactions must be handled asynchronously.
  
### User Feedback

- **Loading Indicators:**
  - When a frontend action triggers a backend API call (e.g., clicking the "Sign In" button), display a spinner or loading indicator on the button to indicate that a process is in progress.
  
### State Management

- The backend should return a state indicating the status of the operation (e.g., `"completed successfully"`).
- Upon receiving a successful state, update the frontend state accordingly (e.g., reset the loading state).

### UI Updates

- Reflect the state change in the UI, such as hiding the "Sign In" button and displaying the "Sign Out" button.

### Error Handling

- **Display meaningful error messages to users** upon failed operations.
- **Ensure that both frontend and backend handle errors gracefully and consistently.**
