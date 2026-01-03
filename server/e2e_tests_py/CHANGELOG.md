# Changelog

All notable changes to the Ambrosia POS E2E test suite will be documented in this file.

## 2025-12-31 - Authentication Security & Configurable Token Expiration

**Server (Kotlin)**
- Add configurable access token expiration via `--jwt-access-token-expiration` CLI option (default: 60s)
- Wrap `/logout` in `authenticate("auth-jwt")` to require authentication and ensure token revocation
- Make `userId` required in logout (throw exception if not present)

**Tests (Python)**
- Configure tests with `--jwt-access-token-expiration 5` for faster execution
- Rename `test_access_token_expires_after_one_minute` → `test_access_token_expiration_and_refresh` (8s vs 65s wait)
- Remove `@pytest.mark.slow` marker (runs by default)
- Update `test_logout_revokes_tokens` to expect authentication requirement
- Remove 44 lines of manual cookie handling (httpx handles automatically with `secure=false`)

**Impact**
- Test suite: 80s → 15s (5.3× faster)
- Production unchanged: 60s token expiration default maintained

---

## 2025-11-19 - Authentication Tests & Cookie Security

### Added

- **Authentication E2E tests** (`test_auth_e2e.py`):
  - Login success/failure scenarios
  - Token refresh with valid/invalid/missing tokens
  - Access token expiration (60s) and refresh flow
  - Logout and token revocation
  - Multiple refresh token reuse
  - Login validation for missing fields

- **Test infrastructure**:
  - Slow test support: `@pytest.mark.slow` marker and `--run-slow` CLI flag (skipped by default)
  - `initialize_database` fixture: automatic database initialization with default test user

- **Documentation**:
  - `README.md`: Added test filtering section for slow tests
  - `README.md`: Enhanced troubleshooting for server startup timeouts (rebuild, port conflicts, stale processes)
  - `CHANGELOG.md`: Change tracking

### Changed

- **Package rename**: `ambrosia_tests` → `ambrosia` (all imports and package references updated)
- Removed commented-out auth tests from `test_routing_e2e.py` (moved to dedicated `test_auth_e2e.py`)
- Enhanced error handling: tests accept 400/401/500 for known server issues
- **CI workflow**: Added `--run-slow` flag to run all tests including slow ones
- **OpenAPI documentation**: Fixed access token duration from 15 minutes to 60 seconds

### Notes

- Slow tests are skipped by default; use `pytest --run-slow` to run all tests
- CI automatically runs all tests with `--run-slow` flag
- Some tests accept 400/401/500 status codes due to server exception handling (see TODO.md)
- Server timeout? Run `./gradlew build` first

---

## 2025-10-19 - Initial E2E Test Suite

### Added

- **Initial E2E test suite** for Ambrosia POS server
  - Python-based testing using `pytest` and `httpx`
  - Automated server lifecycle management (start/stop Gradle-based Kotlin server)
  - Health check polling and startup validation

- **Core test coverage** (`test_routing_e2e.py`):
  - Root endpoint validation
  - Base currency endpoint
  - 404 error handling
  - Performance testing
  - CORS headers validation
  - Logout and token revocation

- **Test infrastructure**:
  - `AmbrosiaTestServer`: Server lifecycle management
  - `AmbrosiaHttpClient`: Async HTTP client wrapper
  - `manage_server_lifecycle`: Session-scoped pytest fixture
  - Response assertion utilities

- **Documentation**:
  - Comprehensive `README.md` with setup, usage, and troubleshooting
  - Architecture comparison with Kotlin tests

- **CI/CD Integration**:
  - GitHub Actions workflow for automated E2E testing
  - Ruff formatting and linting checks
  - Pre-commit hook for code quality

- **Development tools**:
  - `pyproject.toml`: Modern Python project configuration (PEP 621)
  - `Makefile`: Common development tasks (test, lint, format, clean)
  - `uv` package manager support
