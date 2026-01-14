# Propuesta: Estructura de Comandos Claude - Dos Niveles

**Fecha:** 2026-01-13
**Contexto:** Separar comandos para desarrollo DEL framework vs uso CON el framework

---

## 🎯 Propuesta de Estructura:

### **NIVEL 1: Framework Development** (Trabajar SOBRE el framework)
**Contexto:** Estás en este repo mejorando el framework, agregando features como OTP, arreglando bugs del framework mismo.

```
test_project/  (repo actual)
├── .claude/
│   ├── commands-dev/              # Comandos para DESARROLLO del framework
│   │   ├── improve-framework.md   # Agregar features al framework
│   │   ├── fix-framework.md       # Fix bugs del framework
│   │   └── refactor-framework.md  # Refactorizar código del framework
│   │
│   └── commands-user/             # Templates de comandos para USUARIOS
│       ├── new-screen.md          # QA: agregar nueva pantalla
│       ├── fix-test.md            # QA: fix test que falla
│       └── add-coverage.md        # QA: agregar más tests
│
├── CLAUDE-DEV.md                  # Guía para trabajar SOBRE framework
├── CLAUDE.md                      # Guía para trabajar CON framework (se copia al template)
│
├── new_ideas/                     # (gitignored) Experimentos
├── TODO_template.md               # (gitignored) TODOs del framework
│
└── scripts/
    └── create-template.ts         # Actualizar para copiar commands-user/
```

**Git branches:** `framework/add-otp-support`, `framework/fix-self-healing-cache`

---

### **NIVEL 2: End-User QA Work** (Trabajar CON el framework)
**Contexto:** Alguien (incluido tú) clonó el template para un proyecto nuevo de testing.

```
my-app-tests/  (nuevo proyecto)
├── .claude/
│   └── commands/                  # Copiados de commands-user/
│       ├── new-screen.md
│       ├── fix-test.md
│       └── add-coverage.md
│
├── CLAUDE.md                      # Guía para usar el framework
│
├── tests/
│   ├── login/                     # Tests del proyecto
│   ├── dashboard/
│   └── checkout/
│
└── utils/api/
    ├── login-helper.ts            # Helpers del proyecto
    └── dashboard-helper.ts
```

**Git branches:** `feature/test-login-page`, `fix/login-button-selector`

---

## 📋 Contenido de los comandos:

### **commands-dev/** (para desarrollador del framework)

#### `improve-framework.md`
```markdown
---
description: Add new feature to the framework itself
---

# Framework Feature Implementation

You are working ON the framework, not WITH it.
This command is for adding features like:
- New AI helpers (OTP extraction, image comparison)
- New fixtures or utilities
- Framework-level improvements

Phase 0: Create framework branch
  git checkout -b framework/add-{feature}

Phase 1: Explore framework architecture
  - Read existing AI helpers
  - Understand model selection strategy
  - Check integration points

Phase 2: Design & Plan
  - Consider cost implications
  - Choose model (Haiku/Sonnet/Opus)
  - Plan integration with existing code

Phase 3: Implement
  - Write feature code
  - Add types and interfaces
  - Create example tests

Phase 4: Test
  - Test with real API calls
  - Verify cost is reasonable
  - Check error handling

Phase 5: Document
  - Update AI-MODEL-STRATEGY.md with costs
  - Add example to tests/examples/
  - Update CLAUDE.md with new pattern

Phase 6: Commit
  git commit -m "framework: add {feature}

  - Adds {feature} to {location}
  - Uses {model} for cost optimization
  - Example: tests/examples/{feature}-example.spec.ts

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

#### `fix-framework.md`
```markdown
---
description: Fix bug in the framework itself
---

# Framework Bug Fix

You are working ON the framework, not WITH it.
This is for fixing bugs in:
- AI helpers (self-healing, assertions, generator)
- Fixtures or utilities
- Framework architecture

[Similar structure but focused on framework bugs]
```

---

### **commands-user/** (para QA usando el framework)

#### `new-screen.md`
```markdown
---
description: Automate tests for a new screen/feature
---

# New Screen Test Implementation

You are working WITH the framework to test an application.

Phase 0: Create feature branch
  git checkout -b feature/test-{screen-name}

Phase 1: Explore UI
  - Launch codegen: npm run test:codegen
  - Navigate to the screen
  - Interact with elements
  - Note selectors and flows

Phase 2: Plan tests
  - Identify test cases (P1/P2/P3)
  - Ask which tests to implement
  - Decide if AI features needed

Phase 3: Create structure
  1. Create helper: utils/api/{screen}-helper.ts
  2. Create test: tests/{screen}/{screen}-p1.spec.ts
  3. Create docs: docs/{SCREEN}-P2-P3-TESTS.md

Phase 4: Implement
  - Write helper methods (navigation, actions, verifications)
  - Write P1 tests using helper
  - Document P2/P3 tests

Phase 5: Test
  - Run: npm test
  - Fix any issues
  - Ensure all tests pass

Phase 6: Commit
  git commit -m "Add tests: {screen} (TC-XX-001 to TC-XX-00N)

  Implements P1 tests for {screen}:
  - Test case 1
  - Test case 2

  P2/P3 documented in docs/{SCREEN}-P2-P3-TESTS.md

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

Important:
- Follow helper-based pattern
- Only implement P1 tests
- Use AI features selectively (cost)
- All code in English
```

#### `fix-test.md`
```markdown
---
description: Fix failing test
---

# Fix Failing Test

Phase 0: Create fix branch (optional for quick fixes)
  git checkout -b fix/{test-name}

Phase 1: Reproduce
  - Run failing test: npx playwright test -g "{test-name}"
  - Run in debug: npm run test:debug
  - Analyze failure (selector? timing? assertion?)

Phase 2: Diagnose
  Common issues:
  - Selector changed → Update or use self-healing
  - Timing issue → Add waitFor()
  - App behavior changed → Update test logic
  - Test was wrong → Fix test logic

Phase 3: Fix
  - Make minimal changes
  - Update helper if needed
  - Consider self-healing for unstable selectors

Phase 4: Verify
  - Run test: npm test
  - Run full suite to check regressions
  - Must pass before commit

Phase 5: Commit
  git commit -m "Fix: {test-name} - {issue}

  Issue: {what was wrong}
  Fix: {what changed}

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🔄 Actualizar `create-template.ts`:

Agregar paso para copiar comandos de usuario:

```typescript
async function copyUserCommands() {
  console.log('📋 Copying user commands...\n');

  const claudeDir = path.join(ROOT, '.claude');
  const commandsUserDir = path.join(claudeDir, 'commands-user');
  const commandsDir = path.join(claudeDir, 'commands');

  // Remove existing commands/
  await fs.rm(commandsDir, { recursive: true, force: true });

  // Copy commands-user/ to commands/
  await fs.cp(commandsUserDir, commandsDir, { recursive: true });

  console.log('   ✓ Copied user commands to .claude/commands/');
  console.log();
}
```

Y actualizar `.gitignore` para que el template final NO incluya:
```gitignore
# Framework development only (removed in template)
.claude/commands-dev/
CLAUDE-DEV.md
new_ideas/
TODO_template.md
```

---

## 📝 Crear archivos de guía:

### `CLAUDE-DEV.md` (para desarrollo del framework)
```markdown
# Framework Development Guide

You are working ON the framework, improving it for future users.

## Commands Available

- `/improve-framework` - Add new features to framework
- `/fix-framework` - Fix bugs in framework code
- `/refactor-framework` - Refactor framework architecture

## What "framework" means

Framework code:
- config/ai-client.ts
- fixtures/ai-fixtures.ts
- utils/ai-helpers/*
- utils/selectors/self-healing.ts

NOT framework code:
- Project-specific tests
- Project-specific helpers
- Application tests

## Git Workflow

Branches: `framework/add-{feature}` or `framework/fix-{bug}`

## Testing Changes

Test framework changes by:
1. Using in example tests
2. Verifying AI cost is reasonable
3. Testing error cases

## Documentation

Always update:
- AI-MODEL-STRATEGY.md (if costs change)
- CLAUDE.md (if patterns change)
- tests/examples/ (add example)
```

### Actualizar `CLAUDE.md` (simplificar para usuarios)
- Remover referencias a desarrollo del framework
- Enfocarse en USO del framework
- Comandos disponibles: `/new-screen`, `/fix-test`, `/add-coverage`

---

## 💭 Ventajas de esta estructura:

✅ **Separación clara** entre desarrollo y uso
✅ **Comandos específicos** para cada contexto
✅ **No contamina el template** con comandos de desarrollo
✅ **Escalable** - fácil agregar más comandos
✅ **Git workflow diferente** para cada nivel
✅ **Documentación específica** para cada caso

---

## 🚀 Próximos Pasos

Si se aprueba esta propuesta:

1. Crear la estructura `.claude/commands-dev/` y `.claude/commands-user/`
2. Crear `CLAUDE-DEV.md`
3. Adaptar comandos de tu compañero para ambos contextos
4. Actualizar `create-template.ts` para copiar los comandos de usuario
5. Actualizar `.gitignore` con exclusiones apropiadas
6. Actualizar `CLAUDE.md` para enfocarse en uso (no desarrollo)

---

## 📋 Checklist de Implementación

- [ ] Crear estructura de directorios `.claude/`
- [ ] Escribir `commands-dev/improve-framework.md`
- [ ] Escribir `commands-dev/fix-framework.md`
- [ ] Escribir `commands-dev/refactor-framework.md`
- [ ] Escribir `commands-user/new-screen.md`
- [ ] Escribir `commands-user/fix-test.md`
- [ ] Escribir `commands-user/add-coverage.md`
- [ ] Crear `CLAUDE-DEV.md`
- [ ] Actualizar `CLAUDE.md` (simplificar para usuarios)
- [ ] Modificar `create-template.ts` (copiar commands-user)
- [ ] Actualizar `.gitignore`
- [ ] Probar workflow completo
- [ ] Documentar en README si es necesario
