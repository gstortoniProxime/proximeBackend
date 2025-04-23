# 🚀 Proxime – Git Workflow y Convenciones

Este repositorio sigue una convención de ramas clara para facilitar el trabajo colaborativo entre todos los miembros del equipo.

---

## 🧱 Ramas principales

- `main`: código en producción, siempre estable.
- `develop`: código aprobado para pruebas, staging o QA.

---

## 🌿 Ramas por tipo de trabajo

| Tipo de Rama     | Propósito                          | Ejemplo                          |
|------------------|------------------------------------|----------------------------------|
| `feature/*`      | Nueva funcionalidad                | `feature/zones-support`          |
| `fix/*`          | Corrección de errores menores      | `fix/beacon-signal-issue`        |
| `hotfix/*`       | Correcciones urgentes en producción| `hotfix/reservation-crash`       |
| `release/*`      | Preparar nueva versión estable     | `release/v1.2.0`                 |

---

## 🧑‍💻 Cómo trabajar correctamente

### 🔹 1. Crear una nueva rama

```bash
# Desde develop o main
git checkout develop
git pull origin develop

# Crear nueva rama
git checkout -b feature/nombre-rama