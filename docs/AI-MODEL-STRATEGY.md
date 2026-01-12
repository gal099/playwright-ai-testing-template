# AI Model Selection Strategy

Este documento explica cómo se usan diferentes modelos de Claude para optimizar costos y performance.

## Modelos Disponibles

### Haiku (claude-3-haiku-20240307)
- **Costo:** Bajo (~$0.00025 / 1K tokens input, ~$0.00125 / 1K tokens output)
- **Velocidad:** Rápido
- **Uso:** Tareas simples de texto y análisis básico

### Sonnet (claude-3-5-sonnet-20241022)
- **Costo:** Medio (~$0.003 / 1K tokens input, ~$0.015 / 1K tokens output)
- **Velocidad:** Moderado
- **Uso:** Balance entre calidad y costo, visión AI

### Opus (claude-3-opus-20240229)
- **Costo:** Alto (~$0.015 / 1K tokens input, ~$0.075 / 1K tokens output)
- **Velocidad:** Más lento
- **Uso:** Casos complejos que requieren máxima capacidad

## Asignación por Feature

### Self-Healing Selectors → **Haiku**
```typescript
// utils/selectors/self-healing.ts
model: 'haiku'
maxTokens: 1024
```
**Razón:** Análisis simple de DOM y sugerencia de selectores. No requiere razonamiento complejo.

**Costo estimado:** ~$0.002 por selector healed

### Test Generation → **Sonnet**
```typescript
// utils/ai-helpers/test-generator.ts
model: 'sonnet'
maxTokens: 4096
```
**Razón:** Necesita visión AI para analizar screenshots y generar código complejo.

**Costo estimado:** ~$0.05-0.15 por test generado

### AI Assertions

#### Visual State → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Razón:** Requiere capacidades de visión AI avanzadas.

**Costo estimado:** ~$0.01-0.02 por assertion

#### Semantic Content → **Haiku**
```typescript
model: 'haiku'
maxTokens: 512
```
**Razón:** Comparación simple de texto, no requiere visión.

**Costo estimado:** ~$0.001 por assertion

#### Layout → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Razón:** Análisis visual de disposición y estructura.

**Costo estimado:** ~$0.01-0.02 por assertion

#### Accessibility → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Razón:** Requiere análisis visual + comprensión de estándares a11y.

**Costo estimado:** ~$0.01-0.02 por assertion

#### Data Validation → **Haiku**
```typescript
model: 'haiku'
maxTokens: 512
```
**Razón:** Validación lógica simple de datos textuales.

**Costo estimado:** ~$0.001 por validation

### Test Maintenance → **Sonnet**

#### Análisis
```typescript
model: 'sonnet'
maxTokens: 3072
```
**Razón:** Requiere comprensión profunda de patrones de código.

**Costo estimado:** ~$0.02-0.05 por archivo analizado

#### Refactoring
```typescript
model: 'sonnet'
maxTokens: 4096
```
**Razón:** Generación de código complejo manteniendo lógica.

**Costo estimado:** ~$0.05-0.10 por archivo refactorizado

## Estimación de Costos

### Suite de Tests Típica (100 tests)

**Desarrollo inicial:**
- Test generation: 20 tests × $0.10 = **$2.00**
- Manual tests: 80 tests (sin costo AI)

**Ejecución diaria:**
- Self-healing: 5 failures × $0.002 = **$0.01**
- AI assertions: 20 assertions × $0.015 = **$0.30**
- Total por ejecución: **~$0.31**

**Mantenimiento mensual:**
- Análisis suite: 100 tests × $0.03 = **$3.00**
- Refactoring: 10 tests × $0.075 = **$0.75**
- Total mensual: **~$3.75**

**Costo total estimado primer mes:** ~$6.06
**Costo mensual recurrente:** ~$10-15 (con ejecuciones diarias)

## Comparación con Modelo Único

Si usáramos **solo Opus** para todo:
- Costo sería **~5-8x mayor**
- Suite de 100 tests: ~$30-50/mes

Si usáramos **solo Haiku** para todo:
- Costo sería **~80% menor**
- Pero calidad de test generation y visual assertions sería inferior

## Optimizaciones Adicionales

### 1. Cache de Self-Healing
Los selectores healed se cachean, reduciendo llamadas repetidas.

### 2. Deshabilitar AI en CI/CD
Para tests de smoke rápidos, configurar:
```bash
ENABLE_SELF_HEALING=false
ENABLE_AI_ASSERTIONS=false
```

### 3. Selective AI Assertions
Usar AI assertions solo en tests críticos, no en todos.

### 4. Batch Analysis
Analizar múltiples tests juntos en mantenimiento.

## Cuándo Usar Opus

Actualmente Opus es el fallback default, pero puede usarse explícitamente para:
- Debugging de casos complejos
- Primera vez generando tests para aplicación muy compleja
- Análisis profundo de issues de accesibilidad

Para usar Opus explícitamente, modificar el código del feature específico.

## Monitoreo de Costos

Para trackear costos reales:
1. Revisar dashboard de Anthropic
2. Logs muestran qué modelo se usa en cada llamada
3. Considerar agregar telemetría custom

## Actualización de Modelos

Este documento se actualizó: 2025-12-19

Revisar regularmente:
- Nuevos modelos de Anthropic
- Cambios en pricing
- Mejoras en capacidades

## Referencias

- [Anthropic Pricing](https://www.anthropic.com/pricing)
- [Model Comparison](https://docs.anthropic.com/en/docs/models-overview)
