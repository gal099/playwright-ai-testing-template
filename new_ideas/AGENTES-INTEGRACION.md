# Integración de Agentes al Framework

**Fecha**: 2026-01-13
**Versión Framework**: 1.3.0
**Estado**: Ideas para explorar

---

## 🤖 ¿Qué son los Agentes?

Los agentes son **subprocesos especializados** que Claude Code puede lanzar para resolver tareas complejas de forma autónoma. Son como "mini-Claudes" especializados que trabajan de forma independiente.

### Ejemplo de Uso en `/review-changes`

Cuando implementamos el comando `/review-changes`, internamente se lanza un agente usando el **Task tool**:

```typescript
// Ejemplo simplificado
Task({
  subagent_type: "general-purpose",
  description: "Review code changes",
  prompt: "Analyze all changed files and provide comprehensive review..."
})
```

El agente:
- Tiene acceso a herramientas específicas (Read, Grep, Bash, etc.)
- Trabaja de forma autónoma hasta completar la tarea
- Devuelve resultados estructurados
- Mantiene su propio contexto de trabajo

---

## 📚 Tipos de Agentes Disponibles en Claude Code

### 1. **Explore Agent**
Especializado en explorar codebases:
- Búsqueda rápida de archivos y patrones
- Análisis de arquitectura
- Responder preguntas sobre el código
- Niveles: "quick", "medium", "very thorough"

**Uso:**
```typescript
Task({
  subagent_type: "Explore",
  description: "Find similar helpers",
  prompt: "Search for helper patterns in utils/api/ and analyze structure"
})
```

### 2. **Plan Agent**
Arquitecto de software:
- Diseña planes de implementación
- Identifica archivos críticos
- Considera trade-offs arquitecturales
- Retorna step-by-step plans

**Uso:**
```typescript
Task({
  subagent_type: "Plan",
  description: "Plan new feature",
  prompt: "Design implementation plan for image comparison feature"
})
```

### 3. **Bash Agent**
Especialista en línea de comandos:
- Operaciones git
- Ejecución de comandos
- Scripts complejos

**Uso:**
```typescript
Task({
  subagent_type: "Bash",
  description: "Run git operations",
  prompt: "Analyze git history and find commits affecting selectors"
})
```

### 4. **General-Purpose Agent**
Tareas complejas multi-paso:
- Búsqueda iterativa
- Análisis profundo
- Tareas que requieren múltiples herramientas
- El más flexible, usado en `/review-changes`

**Uso:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Complex analysis",
  prompt: "Multi-step task with file reading, analysis, and recommendations"
})
```

---

## 💡 Ideas para Integrar Agentes al Framework

### Idea 1: Agentes en Comandos Existentes

Mejorar comandos actuales usando agentes internamente.

**Ejemplo: Mejorar `/new-screen`**

```markdown
# new-screen.md - Phase 1: Explore UI

**Before manual exploration with codegen:**

1. **Launch Explore Agent** to analyze similar patterns:
   - Find existing helpers for similar screens
   - Identify common patterns and practices
   - Suggest structure based on existing code

2. **Then use codegen** to explore the specific UI

**Benefits:**
- Faster setup with context-aware suggestions
- Consistent patterns across the codebase
- Learning from existing code
```

**Cambios técnicos:**
- Phase 1 del comando lanza un Explore agent
- Agent analiza `utils/api/` para patterns similares
- Retorna sugerencias de estructura
- Usuario tiene contexto antes de empezar

---

### Idea 2: Script de Análisis de Tests

Crear `scripts/analyze-tests.ts` que use agentes para análisis profundo.

**Script:**
```typescript
// scripts/analyze-tests.ts
import { execSync } from 'child_process';
import * as fs from 'fs';

async function analyzeTests() {
  console.log('🔍 Launching Test Analysis Agent...\n');

  // El agente analizaría:
  // 1. Duplicated code across tests
  // 2. Flaky test patterns (arbitrary timeouts, no waits)
  // 3. Missing error handling
  // 4. Selector stability issues
  // 5. Test isolation problems
  // 6. Coverage gaps

  // Genera reporte en markdown
  // Lo guarda en docs/TEST-ANALYSIS.md
}

analyzeTests();
```

**Agregar a package.json:**
```json
{
  "scripts": {
    "analyze:tests": "ts-node scripts/analyze-tests.ts"
  }
}
```

**Uso:**
```bash
npm run analyze:tests
# Output: docs/TEST-ANALYSIS.md con reporte completo
```

**Beneficios:**
- Detección automática de code smells
- Identificación de tests frágiles
- Sugerencias de refactoring
- Mejora continua de calidad

---

### Idea 3: Comando `/refactor-tests`

Nuevo comando que lanza agente para refactoring automático.

**Archivo:** `.claude/commands-user/refactor-tests.md`

```markdown
---
description: Automatically refactor and improve test code
arguments:
  - name: test_path
    description: Path to test file or directory
    required: true
---

# Refactor Tests

Launches an AI agent that analyzes and refactors your tests.

## What the Agent Does

1. **Analyzes test files** in the specified path
2. **Extracts duplicated code** to helper methods
3. **Improves selector stability** (prefers data-testid)
4. **Adds missing assertions** where needed
5. **Removes code smells** (arbitrary timeouts, etc.)
6. **Updates documentation** if needed

## Usage

```bash
/refactor-tests "tests/login/"
/refactor-tests "tests/dashboard/dashboard-p1.spec.ts"
```

## What Gets Changed

- Duplicate code → Helper methods
- Fragile selectors → Stable selectors
- Missing waits → Proper waitForURL/waitForSelector
- Arbitrary timeouts → Removed or replaced
- Missing assertions → Added where logical

## Safety

- Creates backup before changes
- Shows diff for review
- You approve changes before commit
```

**Implementación:**
- Lanza general-purpose agent
- Agent lee archivos, analiza patterns
- Propone cambios específicos
- Usuario revisa y aprueba
- Script aplica cambios

---

### Idea 4: Agente de Generación de Helpers

Script que genera helpers automáticamente analizando la UI.

**Script:** `scripts/generate-helper.ts`

```typescript
// scripts/generate-helper.ts
import { Page, chromium } from '@playwright/test';

async function generateHelper(screenUrl: string, screenName: string) {
  console.log(`🚀 Generating helper for ${screenName}...\n`);

  // 1. Lanzar browser y tomar screenshot
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(screenUrl);
  const screenshot = await page.screenshot();
  await browser.close();

  // 2. Lanzar agent con screenshot
  // El agente:
  //    - Analiza elementos visibles (buttons, forms, inputs)
  //    - Identifica interacciones posibles
  //    - Genera métodos para:
  //      * Navegación (navigateToScreen)
  //      * Acciones comunes (clickButton, fillForm)
  //      * Verificaciones (isScreenVisible, hasExpectedElements)
  //    - Usa selectores estables (data-testid, role, text)
  //    - Escribe archivo en utils/api/{screen}-helper.ts

  console.log(`✅ Helper generated: utils/api/${screenName}-helper.ts`);
}

// Uso:
// ts-node scripts/generate-helper.ts http://localhost:3000/login login
```

**Agregar a package.json:**
```json
{
  "scripts": {
    "generate:helper": "ts-node scripts/generate-helper.ts"
  }
}
```

**Beneficios:**
- Generación rápida de helpers
- Basado en análisis real de UI
- Selectores sugeridos automáticamente
- Punto de partida para personalización

---

### Idea 5: Sistema de Coverage Inteligente

Agente que analiza coverage y sugiere tests faltantes.

**Comando:** `/improve-coverage`

```markdown
---
description: AI agent analyzes coverage and suggests missing tests
arguments:
  - name: feature_name
    description: Feature to analyze
    required: false
---

# Improve Coverage

Launches an AI agent that:

1. **Analyzes existing tests** for a feature
2. **Identifies coverage gaps** (uncovered paths, edge cases)
3. **Reviews P2/P3 documentation** for documented but unimplemented tests
4. **Prioritizes by value** (risk vs. effort)
5. **Generates test skeletons** for high-value missing tests
6. **Updates P2/P3 docs** with new findings

## Usage

```bash
/improve-coverage
/improve-coverage "login"
```

## Output

- **Coverage Report**: Markdown file with analysis
- **Test Skeletons**: Generated test code ready to fill in
- **Priority Suggestions**: Which tests to implement first
```

**Implementación:**
- Agent analiza tests existentes
- Compara con P2/P3 docs
- Identifica gaps lógicos (missing error cases, edge cases)
- Genera esqueletos de tests
- Prioriza por impacto/esfuerzo

---

### Idea 6: Agentes Custom con Claude Agent SDK

Para casos más avanzados, crear **agentes completamente personalizados** usando el SDK oficial.

**Ejemplo: Test Quality Agent**

```typescript
// agents/test-quality-agent.ts
import { Agent } from '@anthropic-ai/agent-sdk';

const testQualityAgent = new Agent({
  name: 'Test Quality Analyzer',
  model: 'claude-3-5-sonnet-20241022',

  tools: [
    // Custom tools específicas para análisis de tests
    {
      name: 'analyze_selectors',
      description: 'Analyze selector stability in test file',
      parameters: { testFile: 'string' },
      execute: async ({ testFile }) => {
        // Lógica para analizar selectores
        // Retorna score y sugerencias
      }
    },
    {
      name: 'check_assertions',
      description: 'Check if test has proper assertions',
      parameters: { testFile: 'string' },
      execute: async ({ testFile }) => {
        // Verifica assertions
      }
    },
    {
      name: 'detect_flakiness',
      description: 'Detect flaky test patterns',
      parameters: { testFile: 'string' },
      execute: async ({ testFile }) => {
        // Busca patterns de flakiness
        // (arbitrary timeouts, no waits, etc.)
      }
    }
  ],

  systemPrompt: `
    You are a test quality expert specializing in Playwright tests.

    Your role:
    - Analyze tests for best practices
    - Identify code smells and anti-patterns
    - Suggest concrete improvements
    - Prioritize issues by severity

    Always provide actionable recommendations with file locations.
  `
});

// Usar el agente
export async function analyzeTestQuality(testPath: string) {
  const analysis = await testQualityAgent.run({
    task: `Analyze tests in ${testPath} for quality issues`
  });

  return analysis;
}
```

**Agregar a package.json:**
```json
{
  "scripts": {
    "agent:quality": "ts-node agents/test-quality-agent.ts"
  }
}
```

**Estructura de carpeta agents/:**
```
agents/
├── test-quality-agent.ts      # Análisis de calidad
├── helper-generator-agent.ts  # Generación de helpers
├── coverage-analyzer-agent.ts # Análisis de coverage
├── refactoring-agent.ts       # Refactoring automático
└── README.md                  # Documentación de agentes
```

---

## 🎯 Propuestas Concretas de Implementación

### Propuesta A: Scripts npm con Agentes (Quick Wins)

**Tiempo estimado:** 1-2 días
**Impacto:** Medio
**Complejidad:** Baja

Agregar al `package.json`:

```json
{
  "scripts": {
    "analyze:tests": "ts-node scripts/analyze-tests.ts",
    "analyze:helpers": "ts-node scripts/analyze-helpers.ts",
    "generate:helper": "ts-node scripts/generate-helper.ts",
    "refactor:tests": "ts-node scripts/refactor-tests.ts"
  }
}
```

Cada script:
- Lanza un agente especializado
- Genera reporte en markdown
- Provee recomendaciones accionables

**Ventajas:**
- Rápido de implementar
- Inmediatamente útil
- No requiere cambios a comandos existentes

**Desventajas:**
- Menos integrado con workflow
- Usuarios deben recordar comandos npm

---

### Propuesta B: Comandos Claude Code con Agentes (Mejor UX)

**Tiempo estimado:** 2-3 días
**Impacto:** Alto
**Complejidad:** Media

Crear nuevos comandos:

```
.claude/commands-user/analyze-tests.md
.claude/commands-user/refactor-tests.md
.claude/commands-user/improve-coverage.md
.claude/commands-dev/analyze-framework.md
```

Cada comando:
- Lanza agente con Task tool
- Workflow estructurado (fases)
- Integrado con comandos existentes

**Ventajas:**
- Mejor UX (consistente con otros comandos)
- Workflow guiado
- Documentación inline

**Desventajas:**
- Más trabajo de documentación
- Requiere entender Task tool bien

---

### Propuesta C: Sistema de Agentes Custom (Máxima Flexibilidad)

**Tiempo estimado:** 1 semana
**Impacto:** Muy Alto
**Complejidad:** Alta

Desarrollar sistema completo de agentes:

```
agents/
├── base-agent.ts              # Clase base para agentes
├── test-quality-agent.ts      # Análisis de calidad
├── helper-generator-agent.ts  # Generación de helpers
├── coverage-analyzer-agent.ts # Análisis de coverage
├── refactoring-agent.ts       # Refactoring automático
└── README.md
```

Con SDK de Anthropic:
- Agentes completamente custom
- Tools específicas por agente
- Máxima flexibilidad

**Ventajas:**
- Control total sobre comportamiento
- Tools custom para necesidades específicas
- Escalable para nuevos casos de uso

**Desventajas:**
- Requiere aprender SDK
- Más código para mantener
- Mayor complejidad

---

### Propuesta D: Enfoque Híbrido (Recomendado)

**Tiempo estimado:** 3-4 días
**Impacto:** Alto
**Complejidad:** Media

Combinar lo mejor de las 3 propuestas:

**Fase 1: Quick Wins** (1 día)
- Agregar 2-3 scripts npm básicos
- `analyze:tests` y `generate:helper`
- Usando Task tool directamente

**Fase 2: Comandos** (2 días)
- Crear `/analyze-tests` y `/refactor-tests`
- Reutilizar lógica de scripts
- Documentación completa

**Fase 3: Agente Custom** (1 día - opcional)
- Un agente custom como proof of concept
- Test Quality Agent con tools específicas
- Base para futuros agentes

**Ventajas:**
- Progreso incremental
- Valor desde Fase 1
- Escalable a largo plazo

---

## 🚀 Casos de Uso Específicos

### Caso 1: Test Code Smell Detector

**Problema:** Tests tienen malos patrones que no detectamos en review manual

**Solución con Agente:**
```bash
npm run analyze:tests
```

Agent encuentra:
- `await page.waitForTimeout(5000)` → Debería ser waitForSelector
- Tests sin assertions
- Selectores frágiles (.class-123)
- Código duplicado entre tests
- Tests que dependen de orden de ejecución

**Output:**
```markdown
# Test Analysis Report

## Critical Issues (3)
1. **Arbitrary Timeout** - tests/login/login-p1.spec.ts:45
   - Found: await page.waitForTimeout(5000)
   - Should: await page.waitForSelector('[data-testid="login-success"]')

## Warnings (5)
1. **Fragile Selector** - tests/dashboard/dashboard-p1.spec.ts:23
   - Found: await page.click('.btn-primary-123')
   - Should: await page.click('[data-testid="submit-btn"]')
```

---

### Caso 2: Automatic Helper Generation

**Problema:** Crear helpers manualmente es tedioso y propenso a errores

**Solución con Agente:**
```bash
npm run generate:helper -- http://localhost:3000/checkout checkout
```

Agent:
1. Toma screenshot del screen
2. Analiza elementos visibles
3. Genera helper con métodos comunes
4. Usa selectores estables

**Output:** `utils/api/checkout-helper.ts`
```typescript
import { Page } from '@playwright/test';

/**
 * Helper for Checkout screen operations
 * Generated by AI Agent on 2026-01-13
 */
export class CheckoutHelper {
  /**
   * Navigate to checkout screen
   */
  async navigateToCheckout(page: Page): Promise<void> {
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Proceed to Checkout');
    await page.waitForURL('**/checkout');
  }

  /**
   * Fill shipping information
   */
  async fillShippingInfo(page: Page, info: ShippingInfo): Promise<void> {
    // AI detected form fields and generated this
    await page.fill('[data-testid="first-name"]', info.firstName);
    await page.fill('[data-testid="last-name"]', info.lastName);
    // ...
  }

  // More methods detected by agent...
}
```

Usuario solo debe:
- Revisar y ajustar
- Agregar lógica específica
- Commit

---

### Caso 3: Coverage Gap Analysis

**Problema:** No sabemos qué tests importantes faltan

**Solución con Agente:**
```bash
/improve-coverage "login"
```

Agent:
1. Lee tests existentes en tests/login/
2. Lee docs/LOGIN-P2-P3-TESTS.md
3. Analiza application code (si disponible)
4. Identifica gaps lógicos

**Output:** `docs/COVERAGE-GAP-ANALYSIS-LOGIN.md`
```markdown
# Coverage Gap Analysis: Login Feature

## Existing Coverage
- ✅ Happy path (valid credentials)
- ✅ Invalid password
- ✅ Invalid email format

## Critical Gaps (P1 - Should Implement)
1. **Account Lockout After Failed Attempts**
   - Risk: Security feature not tested
   - Effort: Medium
   - Test Case: TC-LG-050

2. **Session Timeout Handling**
   - Risk: User experience issue
   - Effort: Low
   - Test Case: TC-LG-051

## Important Gaps (P2 - Consider Implementing)
...

## Test Skeletons Generated
See: tests/login/login-p1-suggested.spec.ts
```

---

## 📊 Comparación de Enfoques

| Enfoque | Tiempo | Complejidad | Flexibilidad | Mantenibilidad | UX |
|---------|--------|-------------|--------------|----------------|-----|
| Scripts npm | 1-2 días | Baja | Media | Alta | Media |
| Comandos Claude | 2-3 días | Media | Media | Alta | Alta |
| Agentes Custom | 1 semana | Alta | Muy Alta | Media | Alta |
| Híbrido (Recomendado) | 3-4 días | Media | Alta | Alta | Alta |

---

## 🎓 Recursos para Aprender Más

### Claude Agent SDK
- GitHub: https://github.com/anthropics/claude-agent-sdk
- Docs: https://docs.anthropic.com/claude/docs/agent-sdk
- Examples: Repo tiene ejemplos de custom agents

### Task Tool (Built-in Agents)
- Explore agent: Para búsquedas en codebase
- Plan agent: Para diseñar implementaciones
- General-purpose: Para tareas complejas
- Ya lo usamos en `/review-changes`!

### Patterns Útiles
- **Iterative Analysis**: Agent lee → analiza → lee más → conclusión
- **Structured Output**: Retornar JSON o markdown estructurado
- **Error Handling**: Agents deben manejar casos edge
- **Cost Optimization**: Usar Haiku cuando sea posible

---

## 💭 Preguntas para Discutir

1. **¿Qué casos de uso te resultan más valiosos?**
   - Análisis de calidad de tests
   - Generación automática de helpers
   - Detección de coverage gaps
   - Refactoring automático
   - Otro?

2. **¿Qué enfoque preferís?**
   - Scripts npm (rápido, simple)
   - Comandos Claude Code (mejor UX)
   - Agentes custom (máxima flexibilidad)
   - Híbrido (recomendado)

3. **¿Qué nivel de automatización?**
   - Solo análisis y recomendaciones (sin cambios automáticos)
   - Generar código pero usuario aprueba
   - Automatización completa con opción de rollback

4. **¿Prioridad de implementación?**
   - ¿Cuál agente implementar primero?
   - ¿Para framework dev o para usuarios finales?

5. **¿Integración con workflow existente?**
   - ¿Integrar con comandos actuales (/new-screen, etc.)?
   - ¿O mantener separado como herramientas auxiliares?

---

## 🎯 Próximos Pasos Sugeridos

### Corto Plazo (Next PR)
1. **Implementar 1-2 scripts npm básicos**
   - `analyze:tests` - Análisis de calidad
   - `generate:helper` - Generación de helpers

2. **Documentar en CLAUDE-DEV.md**
   - Sección "AI Agents"
   - Cómo usar y cuándo

### Mediano Plazo (v1.4.0)
1. **Convertir scripts en comandos**
   - `/analyze-tests`
   - `/refactor-tests`

2. **Crear un agente custom como PoC**
   - Test Quality Agent
   - Base para futuros agentes

### Largo Plazo (v2.0.0)
1. **Sistema completo de agentes**
   - Múltiples agentes especializados
   - Workflow integrado
   - Configuración por usuario

---

## 📝 Notas Adicionales

- **Costo de AI**: Agentes usan API calls, considerar costo en análisis grandes
- **Performance**: Agentes pueden tardar minutos en tareas complejas
- **Testing**: Necesitamos tests para scripts que usan agentes
- **Documentation**: Cada agente necesita docs clara de qué hace y cómo usarlo
- **Extensibilidad**: Diseñar para que usuarios puedan agregar sus propios agentes

---

**Conclusión:** Los agentes son una herramienta poderosa para automatizar tareas complejas de análisis, generación y refactoring. El enfoque híbrido (scripts + comandos + eventual custom agents) ofrece el mejor balance entre velocidad de implementación, UX, y flexibilidad futura.

---

*Documento creado: 2026-01-13*
*Para discutir antes de implementar en v1.4.0*
