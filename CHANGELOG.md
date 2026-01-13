# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-13

### Added

- **Code Standards Section**: New "Code Standards" section in `CLAUDE.md` enforcing English-only code
  - Explicit requirement for all code, comments, tests, and AI-generated content to be in English
  - Clear guidelines for variables, functions, JSDoc, and inline comments
  - Exception documented for user-facing localized documentation

### Fixed

- **Auth Helper URL Validation**: Removed hardcoded fallback URL in `auth-helper.ts` constructor
  - Now throws descriptive error if `APP_URL` is not configured in `.env`
  - Prevents silent failures with incorrect URLs
  - Improves template reusability across projects
- **AI Client System Prompts**: Fixed `askWithImage()` method not accepting system prompts
  - Added optional `systemPrompt` parameter to `AIClient.askWithImage()`
  - Updated all AI helpers to properly pass system prompts
  - Ensures AI model receives proper instructions for all vision-based operations

### Changed

- **Language Standardization**: Updated all code and AI prompts to enforce English output
  - Translated Spanish comments to English in `auth-helper.ts`
  - Updated `test-generator.ts` prompts to explicitly request English code generation
  - Updated `ai-assertions.ts` prompts for English-only responses (visual, layout, accessibility)
  - Updated `test-maintainer.ts` prompts for English-only analysis and suggestions
  - Updated `self-healing.ts` to pass system prompts correctly
- **AI Helper Improvements**: Enhanced all AI helpers with explicit English output requirements
  - `test-generator.ts`: System prompt enforces English for all generated code
  - `ai-assertions.ts`: All assertion methods request English explanations
  - `test-maintainer.ts`: Analysis and refactoring produce English output

### Documentation

- Enhanced `CLAUDE.md` with code standards for international consistency
- All AI-generated content will now follow English-only convention

## [1.1.0] - 2026-01-12

### Added

- **OTP Authentication Support**: Complete email-based verification code extraction system
  - `OTPHelper` facade for easy OTP extraction from emails
  - `MailtrapProvider` integration for Mailtrap email service
  - AI-powered OTP extraction using Claude Haiku (~$0.0001 per extraction)
  - Regex fallback for OTP extraction when AI is disabled
  - Polling mechanism with configurable timeout and retry logic
  - Email filtering by subject and sender
  - Example test suite in `tests/examples/otp-auth-example.spec.ts`
- Extensible email provider architecture (`BaseEmailProvider` interface)
- Environment variables for OTP configuration in `.env.example`
- Documentation for OTP authentication in `CLAUDE.md` and `README.md`
- Cost optimization: OTP extraction uses Haiku model for minimal cost

### Changed

- Updated `CLAUDE.md` with OTP authentication section and patterns
- Updated `README.md` with OTP feature showcase
- Enhanced `.env.example` with Mailtrap credentials placeholders

### Documentation

- Added comprehensive OTP usage examples
- Documented Mailtrap setup process
- Added troubleshooting notes for OTP feature

## [1.0.0] - 2026-01-12

### Added

- Initial release of AI-Powered Playwright Testing Framework
- **AI Integration**: Claude AI for test generation, self-healing, and intelligent assertions
- **Multi-Model Optimization**: Automatic model selection (Haiku/Sonnet/Opus) based on task complexity
- **Self-Healing Selectors**: Auto-repair broken selectors using AI vision + DOM analysis
- **Smart Assertions**: Visual, semantic, layout, and accessibility assertions powered by AI
- **Test Generation**: Generate tests from screenshots using AI vision
- **Test Maintenance Tools**: Analyze and refactor test code
- **Cost Optimization**: Intelligent caching and model selection to minimize API costs
- Helper-based test architecture
- Priority-based test organization (P1/P2/P3)
- Comprehensive documentation in `CLAUDE.md`
- Example tests demonstrating all AI features
- TypeScript configuration with strict type checking
- Playwright configuration with multiple browsers

### Documentation

- `README.md`: Project overview and quick start guide
- `CLAUDE.md`: Comprehensive guide for Claude Code integration
- `GETTING-STARTED.md`: Detailed setup instructions
- `QUICK-REFERENCE.md`: Command reference
- `docs/AI-MODEL-STRATEGY.md`: Cost optimization strategy
- `docs/MODEL-OPTIMIZATION-SUMMARY.md`: Implementation summary
- `docs/EXAMPLE-P2-P3-TESTS.md`: Test documentation template

---

## Version History

- **1.2.0**: Code standards enforcement and bug fixes
- **1.1.0**: OTP authentication feature
- **1.0.0**: Initial release

## Links

- [Repository](https://github.com/gal099/playwright-ai-testing-template)
- [Issues](https://github.com/gal099/playwright-ai-testing-template/issues)
