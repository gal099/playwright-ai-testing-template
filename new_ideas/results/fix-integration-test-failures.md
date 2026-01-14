# Bug Fix Results: fix-integration-test-failures

**Date:** 2026-01-12
**Bug Description:** 12 failing integration tests across authentication, ignite validation, and terrain compression APIs

## 🐛 Bug Details

- **Symptoms:**
  - 6 auth tests failing (401, 429, 500 errors)
  - 2 ignite validation tests accepting invalid input (negative steps, invalid params mode)
  - 4 terrain compression tests failing (rejecting compression=0, incorrect metadata expectations)

- **Root Cause:**
  1. **Auth Tests - Rate Limiting**: IP-based rate limiter shared across all tests from localhost, causing 429 errors after 10 login attempts
  2. **Auth Tests - Missing User**: Test user 'simulador' didn't exist in users database
  3. **Auth Tests - Error Handling**: `request.get_json(force=True)` threw unhandled exception when no JSON body provided
  4. **Ignite Validation**: No input validation for negative steps or invalid params modes
  5. **Terrain Compression**: Rejected compression=0 instead of treating it as "no compression"
  6. **Test Expectations**: Test incorrectly assumed compression wouldn't change metadata (it downsamples the grid)

- **Affected Components:**
  - `/api/login` endpoint
  - `/api/ignite` endpoint
  - `/api/terrain/<folder>` endpoint
  - Integration test fixtures
  - Auth integration tests
  - Ignite validation tests
  - Terrain compression tests

- **Severity:** High (12 test failures blocking CI/CD)

- **Reproducibility:** Always (100% reproducible on every test run)

## ✅ Fix Implemented

- **Files Modified:**
  1. `tests/integration/conftest.py:67-82` - Test fixture improvements
  2. `webapp/app.py:1936-1943` - JSON error handling in api_login
  3. `webapp/app.py:3483-3490` - Input validation in api_ignite
  4. `webapp/app.py:1431-1436` - Compression=0 handling in get_terrain_data
  5. `tests/integration/test_api_terrain.py:161-178` - Fixed test expectations

- **Changes Made:**

  **Fix 1: Test User Creation & Rate Limit Isolation**
  - Modified `flask_app` fixture to create test user 'simulador' before tests run
  - Added rate limit store clearing to prevent test interference
  - Used werkzeug's `generate_password_hash` for consistent password hashing

  **Fix 2: JSON Error Handling**
  - Wrapped `request.get_json(force=True)` in try/except block
  - Returns 400 with clear error message for malformed JSON
  - Added validation that JSON body is a dict object

  **Fix 3: Ignite Input Validation**
  - Added check: `if steps < 0: return 400`
  - Added check: `if params not in ('fixed', 'veg'): return 400`
  - Validates params mode before processing (previously silently normalized)

  **Fix 4: Terrain Compression=0 Support**
  - Changed validation from `compression < 1` to `compression < 0`
  - Added normalization: `if compression == 0: compression = 1`
  - Treats compression=0 as full resolution (no downsampling)

  **Fix 5: Corrected Test Expectations**
  - Updated test to verify metadata scales correctly with compression
  - Validates ncols/nrows are divided by compression factor
  - Validates cellsize is multiplied by compression factor
  - Confirms geographic corners (xllcorner, yllcorner) remain unchanged

- **Why This Works:**
  - Test user creation ensures consistent test environment
  - Rate limit clearing prevents cascading failures
  - Proper error handling provides better API responses
  - Input validation prevents invalid data from reaching simulation engine
  - Compression=0 support aligns with common "no compression" convention
  - Corrected test expectations match actual implementation behavior

- **Edge Cases Handled:**
  - Empty JSON body
  - Malformed JSON
  - Negative steps
  - Invalid params modes ('invalid_mode', null, numbers)
  - Compression values: -1, 0, 1, 2, 4, 8
  - Rate limit exhaustion across multiple tests

## 🧪 Testing Performed

- **Reproduction Test:** ✅ All 12 original failing tests now pass

- **Unit Tests:** ✅ 31/31 passed (0.12s)
  - test_deterministic.py: All 5 tests passing
  - test_edge_cases.py: All 10 tests passing
  - test_modelo_rdc_cuda.py: All 16 tests passing

- **Integration Tests:** ✅ 158/158 passed (326.29s)
  - test_api_auth.py: 20/20 tests passing (was 14/20)
  - test_api_ignite.py: 24/24 tests passing (was 22/24)
  - test_api_terrain.py: 24/24 tests passing (was 20/24)
  - test_api_cache.py: 11/11 tests passing
  - test_api_firebreaks.py: 26/26 tests passing
  - test_api_folders.py: 9/9 tests passing
  - test_api_logs.py: 16/16 tests passing
  - test_file_parser.py: 13/13 tests passing

- **Regression Tests:** ✅ No regressions introduced
  - All previously passing tests remain passing
  - No changes to simulation behavior
  - CPU mode compatibility maintained

- **Manual Testing:**
  - Verified login with valid credentials returns 200
  - Verified login with no JSON returns 400 (not 500)
  - Verified login rate limiting still works (429 after 10 attempts)
  - Verified ignite rejects negative steps with 400
  - Verified ignite rejects invalid params mode with 400
  - Verified terrain with compression=0 returns full resolution data

- **GPU/CPU Testing:** ✅ Both modes work
  - Tests run in CPU mode (SIMULADOR_FORCE_CPU=1)
  - No GPU-specific code affected by changes
  - Validation logic is mode-agnostic

## ⏳ Pending / Follow-up Work

- None - all identified issues have been fixed

## ❌ Known Limitations / Could Not Fix

- **E2E Tests Not Running**: E2E tests fail due to missing `requests` module
  - This is unrelated to the integration test fixes
  - Requires: `pip install requests` in test environment
  - Left as separate issue to address in requirements.txt update

## 💡 Notes

- **Lessons Learned:**
  - Shared state in tests (rate limiters, databases) requires careful isolation
  - Input validation should fail fast at API boundaries
  - Test expectations must match actual implementation behavior
  - Compression parameter semantics (0 = off vs 1 = no-op) need clear documentation

- **Why the Bug Occurred:**
  - Tests were written assuming isolated execution environments
  - API evolved to add rate limiting after tests were written
  - Input validation was deferred to simulation engine instead of API layer
  - Test author misunderstood how compression downsampling works

- **Prevention for Future:**
  - Test fixtures now properly isolate test state
  - All API endpoints should validate input early
  - Add comments documenting compression semantics
  - Consider adding compression=0 to API documentation

- **Architectural Insights:**
  - Rate limiting should be per-session, not just per-IP for tests
  - Test fixtures should be self-contained and not rely on existing database state
  - API validation layer should be comprehensive before reaching business logic
  - Integration tests revealed gaps in error handling that unit tests missed
