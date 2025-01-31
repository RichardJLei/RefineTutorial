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

- **Asynchronous Communication:** Follow Refine's simple-rest data provider best practices.

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

- **Framework:** Refine React Framework.
- **Authentication & Storage:** Firebase Auth and Filebase Storage.
- **Data provider:** Refine's Simple REST data provider.
- **Asynchronous Communication:** Follow Refine's simple-rest data provider best practices.
- **User Feedback:** Follow Refine's simple-rest data provider best practices.
- **State Management:** Follow Refine's simple-rest data provider best practices.
- **UI Updates:** Follow Refine's simple-rest data provider best practices.
  
