# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- **1.1.0**: OTP authentication feature
- **1.0.0**: Initial release

## Links

- [Repository](https://github.com/gal099/playwright-ai-testing-template)
- [Issues](https://github.com/gal099/playwright-ai-testing-template/issues)
