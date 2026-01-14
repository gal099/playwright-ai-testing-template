# Plan de Implementación: Sistema de Comandos Claude (Dos Niveles)

**Fecha de Creación:** 2026-01-13
**Objetivo:** Implementar sistema de comandos separado para desarrollo DEL framework vs uso CON el framework
**Referencia:** `PROPUESTA-ESTRUCTURA-COMANDOS.md`

---

## 📋 Estado General

- [ ] **Fase 0:** Preparación y estructura base
- [ ] **Fase 1:** Comandos Framework Development (commands-dev/)
- [ ] **Fase 2:** Comandos End Users (commands-user/)
- [ ] **Fase 3:** Documentación (CLAUDE-DEV.md y actualizar CLAUDE.md)
- [ ] **Fase 4:** Scripts y configuración
- [ ] **Fase 5:** Testing y validación

---

## 🎯 Fase 0: Preparación y Estructura Base

**Objetivo:** Crear directorios y preparar el terreno

### Tareas:
- [ ] Crear directorio `.claude/` si no existe
- [ ] Crear directorio `.claude/commands-dev/`
- [ ] Crear directorio `.claude/commands-user/`
- [ ] Hacer backup de archivos que se van a modificar:
  - [ ] `CLAUDE.md` → `CLAUDE.md.backup`
  - [ ] `.gitignore` → `.gitignore.backup`
  - [ ] `scripts/create-template.ts` → `scripts/create-template.ts.backup`

### Validación:
```bash
ls -la .claude/
# Debe mostrar: commands-dev/ y commands-user/
```

### Notas:
- Los backups se pueden borrar al final si todo sale bien
- Esta fase es rápida (5 minutos)

---

## 🔧 Fase 1: Comandos Framework Development

**Objetivo:** Crear comandos COMPLETOS para trabajar SOBRE el framework

**Orden de implementación:** Un comando a la vez, validar antes de continuar

### 1.1: Crear `improve-framework.md`
- [ ] Crear archivo `.claude/commands-dev/improve-framework.md`
- [ ] Incluir front matter YAML con `arguments:`
- [ ] Agregar `$ARGUMENTS` y task statement
- [ ] Escribir Phase 0: Create Framework Branch
- [ ] Escribir Phase 1: Explore & Understand (READ-ONLY)
- [ ] Escribir Phase 2: Design & Plan
- [ ] Escribir Phase 3: Implementation
- [ ] Escribir Phase 4: Testing & Validation
- [ ] Escribir Phase 5: Documentation & Commit
- [ ] Escribir Phase 6: Create Documentation (opcional, evaluar si necesario)
- [ ] Agregar Framework-Specific Constraints
- [ ] Agregar Workflow Reminders

**Estructura del comando:**
```markdown
---
description: Add new feature to the framework itself
arguments:
  - name: feature_description
    description: Description of the framework feature to implement
    required: true
---

# Framework Feature Implementation

Your task is to implement the following framework feature: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Framework Branch
[Detalles completos con git commands]

## Phase 1: Explore & Understand (READ-ONLY - No Code Yet!)
**Objective:** Thoroughly understand the problem space before writing any code.
[Detalles completos]

[... más fases ...]

## Framework-Specific Constraints
[Constraints específicos del framework]

## Workflow Reminders
[Reminders importantes]
```

**Validación:**
- Revisar que tenga TODAS las secciones del comando original
- Verificar que los ejemplos de bash sean correctos
- Comprobar que las adaptaciones (AI models, npm test, etc.) tengan sentido

---

### 1.2: Crear `fix-framework.md`
- [ ] Crear archivo `.claude/commands-dev/fix-framework.md`
- [ ] Incluir front matter YAML completo
- [ ] Agregar `$ARGUMENTS` y task statement
- [ ] Escribir Phase 0: Create Fix Branch
- [ ] Escribir Phase 1: Reproduce & Understand (READ-ONLY)
- [ ] Escribir Phase 2: Root Cause Analysis & Fix Strategy
- [ ] Escribir Phase 3: Implementation
- [ ] Escribir Phase 4: Testing & Validation
- [ ] Escribir Phase 5: Documentation & Commit
- [ ] Escribir Phase 6: Create Documentation (opcional)
- [ ] Agregar Framework-Specific Constraints
- [ ] Agregar Workflow Reminders
- [ ] Agregar Bug Fix Best Practices

**Validación:**
- Comando completo siguiendo estructura original
- Adaptado a contexto de framework (no proyecto)

---

### 1.3: Crear `refactor-framework.md` (OPCIONAL)
- [ ] Decidir si este comando es necesario ahora
- [ ] Si sí, crear con estructura similar

**Notas:**
- Este comando puede esperar, no es crítico
- Se puede agregar después si se necesita

---

## 👥 Fase 2: Comandos End Users

**Objetivo:** Crear comandos COMPLETOS para trabajar CON el framework (QA usando template)

**Orden de implementación:** Un comando a la vez

### 2.1: Crear `new-screen.md`
- [ ] Crear archivo `.claude/commands-user/new-screen.md`
- [ ] Incluir front matter YAML con `arguments:`
- [ ] Agregar `$ARGUMENTS` y task statement
- [ ] Escribir Phase 0: Create Feature Branch
- [ ] Escribir Phase 1: Explore UI (codegen, no solo "understand")
- [ ] Escribir Phase 2: Plan Tests (P1/P2/P3)
- [ ] Escribir Phase 3: Create Structure (helper + test + docs)
- [ ] Escribir Phase 4: Implementation
- [ ] Escribir Phase 5: Testing & Validation
- [ ] Escribir Phase 6: Documentation & Commit
- [ ] Agregar Project-Specific Constraints (helper-based, P1 only, English only)
- [ ] Agregar Workflow Reminders

**Adaptaciones específicas:**
- Phase 1 debe incluir `npm run test:codegen`
- Phase 3 debe crear helper, test file, y P2/P3 docs
- Constraints deben mencionar helper-first approach
- Constraints deben incluir AI cost awareness

**Validación:**
- Comando completo y adaptado a Playwright/QA workflow
- Todos los paths y comandos son correctos para el framework

---

### 2.2: Crear `fix-test.md`
- [ ] Crear archivo `.claude/commands-user/fix-test.md`
- [ ] Incluir front matter YAML
- [ ] Agregar `$ARGUMENTS` y task statement
- [ ] Escribir Phase 0: Create Fix Branch (opcional para quick fixes)
- [ ] Escribir Phase 1: Reproduce
- [ ] Escribir Phase 2: Diagnose (selector/timing/assertion issues)
- [ ] Escribir Phase 3: Fix (minimal changes)
- [ ] Escribir Phase 4: Verify (npm test must pass)
- [ ] Escribir Phase 5: Commit
- [ ] Agregar common test issues troubleshooting
- [ ] Agregar self-healing suggestions
- [ ] Agregar Workflow Reminders

**Adaptaciones específicas:**
- Troubleshooting debe incluir Playwright-specific issues
- Sugerir self-healing fixtures cuando sea apropiado
- Comandos de debug: `npm run test:debug`, UI mode, etc.

**Validación:**
- Comando completo y útil para QA diario
- Troubleshooting cubre casos comunes

---

### 2.3: Crear `add-coverage.md`
- [ ] Crear archivo `.claude/commands-user/add-coverage.md`
- [ ] Incluir front matter YAML
- [ ] Agregar `$ARGUMENTS` y task statement
- [ ] Escribir Phase 0: Create Feature Branch
- [ ] Escribir Phase 1: Review Existing (helper + P2/P3 docs)
- [ ] Escribir Phase 2: Select Tests (which P2/P3 to promote)
- [ ] Escribir Phase 3: Implementation
- [ ] Escribir Phase 4: Testing & Validation
- [ ] Escribir Phase 5: Commit
- [ ] Agregar Workflow Reminders

**Validación:**
- Comando claro para promover tests P2→P1
- Usa helper existente, no crea nuevo

---

## 📚 Fase 3: Documentación

**Objetivo:** Crear/actualizar archivos de guía

### 3.1: Crear `CLAUDE-DEV.md`
- [ ] Crear archivo `CLAUDE-DEV.md` en root
- [ ] Agregar sección: Project Overview (framework development)
- [ ] Agregar sección: Commands Available
- [ ] Agregar sección: What "framework" means (qué es vs qué no es)
- [ ] Agregar sección: Git Workflow (branches framework/*)
- [ ] Agregar sección: Testing Changes
- [ ] Agregar sección: Documentation Requirements
- [ ] Agregar sección: Cost Considerations (AI model selection)
- [ ] Agregar sección: When to Update Template

**Estructura sugerida:**
```markdown
# Framework Development Guide

**You are working ON the framework, improving it for future users.**

## Commands Available

- `/improve-framework <description>` - Add new features to framework
- `/fix-framework <bug_description>` - Fix bugs in framework code
- `/refactor-framework <description>` - Refactor framework architecture (optional)

## What "Framework" Means

Framework code (what you're improving):
- `config/ai-client.ts` - Claude API client
- `fixtures/ai-fixtures.ts` - AI-enhanced fixtures
- `utils/ai-helpers/*` - AI utilities (test-generator, ai-assertions, etc.)
- `utils/selectors/self-healing.ts` - Self-healing selectors
- `utils/api/auth-helper.ts` - Core auth helper
- `utils/api/otp-helper.ts` - OTP authentication

NOT framework code (project-specific, created by users):
- `tests/` (except `tests/examples/`)
- Project-specific helpers in `utils/api/`
- `docs/*-P2-P3-TESTS.md` (except EXAMPLE)

[... más secciones ...]
```

**Validación:**
- Guía clara y completa
- Ejemplos concretos de qué es/no es framework

---

### 3.2: Actualizar `CLAUDE.md`
- [ ] Abrir archivo actual `CLAUDE.md`
- [ ] Remover secciones de framework development
- [ ] Simplificar enfoque: uso del framework como QA
- [ ] Agregar sección de comandos disponibles:
  - `/new-screen <screen_name>` - Automate new screen
  - `/fix-test <test_name>` - Fix failing test
  - `/add-coverage <feature_name>` - Add more tests
- [ ] Mantener secciones útiles para QA:
  - Commands Reference (npm scripts)
  - Architecture (helper-based, AI model strategy)
  - Test Organization (P1/P2/P3)
  - Common Patterns & Gotchas
  - Environment Variables
- [ ] Asegurar que el tono sea "you're using this framework"

**Cambios clave:**
- De "mejorando framework" → "usando framework para testear app"
- Agregar referencias a comandos `/new-screen`, `/fix-test`
- Mantener info de AI features, pero desde perspectiva de usuario

**Validación:**
- CLAUDE.md enfocado en uso, no desarrollo
- Referencias a comandos correctas
- Tono apropiado para QA usando template

---

## 🔧 Fase 4: Scripts y Configuración

**Objetivo:** Actualizar scripts y archivos de configuración

### 4.1: Actualizar `scripts/create-template.ts`
- [ ] Abrir archivo `scripts/create-template.ts`
- [ ] Agregar función `copyUserCommands()`
- [ ] Agregar lógica para:
  - Eliminar `.claude/commands-dev/` del template
  - Copiar `.claude/commands-user/` a `.claude/commands/`
  - Eliminar `CLAUDE-DEV.md` del template
  - Mantener `CLAUDE.md` actualizado
- [ ] Agregar a la función `main()` el llamado a `copyUserCommands()`
- [ ] Probar que el script compile: `npx ts-node scripts/create-template.ts --dry-run` (si existe flag)

**Código a agregar:**
```typescript
async function copyUserCommands() {
  console.log('📋 Copying user commands to template...\n');

  const claudeDir = path.join(ROOT, '.claude');
  const commandsDevDir = path.join(claudeDir, 'commands-dev');
  const commandsUserDir = path.join(claudeDir, 'commands-user');
  const commandsDir = path.join(claudeDir, 'commands');

  // Remove commands-dev (not for end users)
  try {
    await fs.rm(commandsDevDir, { recursive: true, force: true });
    console.log('   ✓ Removed commands-dev/ (framework development only)');
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.log(`   ⚠ Could not remove commands-dev/: ${error.message}`);
    }
  }

  // Copy commands-user to commands
  try {
    await fs.rm(commandsDir, { recursive: true, force: true });
    await fs.cp(commandsUserDir, commandsDir, { recursive: true });
    console.log('   ✓ Copied user commands to .claude/commands/');
  } catch (error: any) {
    console.log(`   ⚠ Could not copy user commands: ${error.message}`);
  }

  // Remove commands-user source
  try {
    await fs.rm(commandsUserDir, { recursive: true, force: true });
    console.log('   ✓ Removed commands-user/ source');
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.log(`   ⚠ Could not remove commands-user/: ${error.message}`);
    }
  }

  console.log();
}

async function removeFrameworkDevFiles() {
  console.log('🗑️  Removing framework development files...\n');

  const devFiles = [
    'CLAUDE-DEV.md',
    'new_ideas',
    'TODO_template.md'
  ];

  for (const file of devFiles) {
    const fullPath = path.join(ROOT, file);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true });
        console.log(`   ✓ Deleted directory: ${file}`);
      } else {
        await fs.unlink(fullPath);
        console.log(`   ✓ Deleted file: ${file}`);
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.log(`   ⚠ Could not delete ${file}: ${error.message}`);
      }
    }
  }
  console.log();
}
```

**En función main(), agregar después de deleteItems():**
```typescript
async function main() {
  // ...
  await deleteItems();
  await removeFrameworkDevFiles();  // NUEVO
  await copyUserCommands();         // NUEVO
  await createExampleFiles();
  // ...
}
```

**Validación:**
- Script compila sin errores
- Funciones agregadas en orden lógico

---

### 4.2: Actualizar `.gitignore`
- [ ] Abrir `.gitignore`
- [ ] Verificar que ya tenga `new_ideas/` y `TODO_template.md`
- [ ] Agregar comentario explicando qué se ignora para framework dev
- [ ] NO ignorar `.claude/` (necesitamos versionarlo)

**Agregar al final:**
```gitignore
# Framework Development (removed when creating template)
# These files are for working ON the framework, not WITH it
# The create-template script removes them automatically
CLAUDE-DEV.md
```

**Nota:** `new_ideas/` y `TODO_template.md` ya están en `.gitignore` (líneas 39-40)

**Validación:**
- `.gitignore` tiene comentarios claros
- No ignora `.claude/` (queremos versionarlo)

---

### 4.3: Actualizar `.claudeignore` (si existe)
- [ ] Verificar si existe `.claudeignore`
- [ ] Si existe, asegurar que NO ignore `.claude/commands/`
- [ ] Agregar comentario si es necesario

**Si existe, verificar:**
```
# ✅ DEBE estar ignorado (no queremos que Claude lea esto)
node_modules/
test-results/
playwright-report/

# ❌ NO debe estar ignorado (Claude necesita leer los comandos)
# .claude/  <- NO debe aparecer aquí
```

**Validación:**
- Claude puede leer `.claude/commands/`

---

## ✅ Fase 5: Testing y Validación

**Objetivo:** Probar que todo funcione correctamente

### 5.1: Testing Manual de Comandos Dev
- [ ] Probar comando `/improve-framework` con Claude Code
  - [ ] Verificar que muestre las fases
  - [ ] Verificar que pida descripción
  - [ ] Verificar que cree branch correcto
  - [ ] Validar que siga workflow completo
- [ ] Probar comando `/fix-framework` con Claude Code
  - [ ] Verificar workflow de fix
  - [ ] Validar que pida descripción de bug

**Método de prueba:**
1. En Claude Code, escribir `/improve-framework "test command"`
2. Observar que Claude siga el workflow
3. Interrumpir antes de hacer cambios reales

**Validación:**
- Comandos se cargan correctamente
- Claude sigue las fases
- No salta steps

---

### 5.2: Testing de create-template.ts
- [ ] Ejecutar `npm run create-template` en un branch temporal
  - [ ] Verificar que elimine archivos de framework dev
  - [ ] Verificar que copie comandos de user
  - [ ] Verificar que la estructura quede correcta
- [ ] Revisar el template resultante:
  - [ ] `.claude/commands/` tiene los comandos de usuario
  - [ ] NO existe `.claude/commands-dev/`
  - [ ] NO existe `CLAUDE-DEV.md`
  - [ ] SÍ existe `CLAUDE.md` actualizado

**Comandos:**
```bash
# Crear branch temporal para testing
git checkout -b test-template-creation

# Ejecutar script
npm run create-template

# Verificar estructura
ls -la .claude/
ls -la .claude/commands/

# Verificar archivos eliminados
ls CLAUDE-DEV.md  # Debe dar error "No such file"

# Volver a main y eliminar branch de test
git checkout main
git branch -D test-template-creation
```

**Validación:**
- Script ejecuta sin errores
- Estructura correcta en template
- Archivos de dev eliminados

---

### 5.3: Testing de Comandos User en Template
- [ ] Usar `init-new-project.sh` para crear proyecto de prueba
- [ ] En el proyecto nuevo, probar comandos:
  - [ ] `/new-screen "test-screen"`
  - [ ] `/fix-test "some-test"`
- [ ] Verificar que los comandos funcionen en contexto de usuario

**Comandos:**
```bash
# Crear proyecto de prueba
./scripts/init-new-project.sh test-commands-validation /tmp/test-commands-validation

# Ir al proyecto
cd /tmp/test-commands-validation

# Abrir con Claude Code y probar comandos
# /new-screen "login"
# /fix-test "example-test"

# Limpiar después
cd -
rm -rf /tmp/test-commands-validation
```

**Validación:**
- Comandos disponibles en proyecto nuevo
- Comandos de dev NO disponibles
- Workflow apropiado para QA

---

### 5.4: Testing de Documentación
- [ ] Revisar `CLAUDE-DEV.md` para coherencia
- [ ] Revisar `CLAUDE.md` actualizado para coherencia
- [ ] Verificar que ejemplos funcionen
- [ ] Verificar que referencias a archivos sean correctas

**Checklist de revisión:**
- [ ] No hay referencias rotas (archivos que no existen)
- [ ] Comandos de bash son correctos
- [ ] Ejemplos de código compilan
- [ ] Tono y contexto son apropiados (dev vs user)

---

## 📦 Fase 6: Finalización y Limpieza

**Objetivo:** Limpiar y documentar el trabajo completado

### 6.1: Commit de cambios
- [ ] Revisar todos los cambios: `git status`
- [ ] Stage archivos nuevos:
  ```bash
  git add .claude/
  git add CLAUDE-DEV.md
  git add scripts/create-template.ts
  git add .gitignore
  ```
- [ ] Crear commit descriptivo:
  ```bash
  git commit -m "Add two-level command system for framework dev and user workflows

  - Created .claude/commands-dev/ for framework development
  - Created .claude/commands-user/ for end-user QA work
  - Added CLAUDE-DEV.md for framework developers
  - Updated CLAUDE.md for framework users
  - Updated create-template.ts to copy user commands
  - Commands follow structured workflow with phases

  Framework dev commands:
  - /improve-framework - Add features to framework
  - /fix-framework - Fix framework bugs

  User commands (in template):
  - /new-screen - Automate new screen testing
  - /fix-test - Fix failing tests
  - /add-coverage - Add more test coverage

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
  ```

---

### 6.2: Limpieza de backups
- [ ] Si todo funciona bien, eliminar backups:
  ```bash
  rm CLAUDE.md.backup
  rm .gitignore.backup
  rm scripts/create-template.ts.backup
  ```

---

### 6.3: Actualizar documentación de propuesta
- [ ] Actualizar `new_ideas/PROPUESTA-ESTRUCTURA-COMANDOS.md`
- [ ] Marcar como "✅ IMPLEMENTADO"
- [ ] Agregar notas de implementación si hubo cambios

---

### 6.4: Crear resumen de implementación
- [ ] Crear archivo `new_ideas/IMPLEMENTACION-COMPLETADA.md`
- [ ] Documentar:
  - Qué se implementó
  - Qué cambios se hicieron vs plan original
  - Cómo usar los comandos
  - Próximos pasos o mejoras futuras

---

## 🎯 Estrategia de Implementación Sugerida

### Opción A: Todo de una vez (Riesgoso)
- Hacer todas las fases seguidas
- ❌ Si algo falla, difícil de debuggear
- ❌ Commit gigante difícil de revisar

### Opción B: Fase por fase con commits (Recomendado)
- ✅ Hacer Fase 0 → commit
- ✅ Hacer Fase 1 completa → commit
- ✅ Hacer Fase 2 completa → commit
- ✅ Y así sucesivamente
- ✅ Si algo falla, fácil hacer rollback
- ✅ Progreso visible

### Opción C: Comando por comando (Más granular)
- ✅ Hacer Fase 1.1 → commit
- ✅ Hacer Fase 1.2 → commit
- ✅ Súper granular, fácil de debuggear
- ❌ Muchos commits pequeños

**Recomendación:** Opción B (fase por fase con commits)

---

## 📝 Notas Importantes

### Durante la implementación:
1. **No saltear fases** - Seguir el orden establecido
2. **Validar antes de continuar** - Cada fase tiene checklist de validación
3. **Hacer commits regulares** - Al completar cada fase
4. **Testear en branch temporal** - No romper main

### Si algo sale mal:
1. **Revisar backups** - Están en `.backup`
2. **Git reset si es necesario** - `git reset --hard HEAD~1`
3. **Revisar este plan** - Releer la fase problemática
4. **Pedir ayuda** - Claude puede ayudar a debuggear

### Comandos útiles:
```bash
# Ver estructura de .claude/
tree .claude/

# Ver qué archivos están staged
git status

# Ver diff antes de commit
git diff --staged

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (borrar cambios)
git reset --hard HEAD~1
```

---

## ✅ Checklist Final

Antes de dar por terminada la implementación, verificar:

- [ ] Todos los comandos existen y están completos
- [ ] CLAUDE-DEV.md existe y es claro
- [ ] CLAUDE.md está actualizado para usuarios
- [ ] create-template.ts funciona correctamente
- [ ] Template generado tiene estructura correcta
- [ ] Comandos se pueden invocar en Claude Code
- [ ] Documentación es coherente
- [ ] No hay archivos de desarrollo en template
- [ ] Git history es limpio
- [ ] Backups eliminados

---

## 🚀 Comenzar Implementación

**Para empezar:**
1. Leer este plan completo
2. Hacer preguntas si algo no está claro
3. Empezar con Fase 0
4. Seguir el plan fase por fase
5. Validar cada fase antes de continuar

**Comando para iniciar:**
```bash
# Asegurarse de estar en branch correcto
git checkout main
git pull

# Crear branch para esta implementación
git checkout -b framework/add-command-system

# Empezar con Fase 0
```

---

**¿Listo para empezar? ¡Adelante con Fase 0!**
