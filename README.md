# Project Angular — Diario de configuración

Este documento recoge, paso a paso, cómo se ha montado este proyecto Angular desde cero. Está pensado para poder repetir el proceso en otro proyecto o para recordar por qué se hizo cada cosa y no solo el comando.

> Angular 21/22 · Node.js 24 · npm 12

---

## 1. Crear el proyecto

```bash
ng new nombre-proyecto --routing --style=scss
cd nombre-proyecto
```

- `--routing` genera ya el archivo `app.routes.ts`.
- `--style=scss` usa SCSS en vez de CSS plano.
- Cuando el CLI pregunte por SSR (Server-Side Rendering), respondimos **No** para mantener el proyecto simple mientras se aprende.
- `ng new` inicializa Git automáticamente (ya hay un primer commit hecho por el propio CLI).

## 2. Estructura de carpetas

Dentro de `src/app/` se creó esta estructura:

```
src/app/
├── pages/               # Páginas principales (una por ruta, normalmente)
├── components/           # Componentes reutilizables entre páginas
├── models/               # Interfaces TypeScript (forma de los datos)
├── services/             # Lógica de negocio, llamadas HTTP, estado compartido
├── core/
│   ├── guards/            # Protección de acceso a rutas
│   └── interceptors/      # Modificación de peticiones/respuestas HTTP
├── directives/            # Directivas personalizadas
├── pipes/                 # Pipes personalizados
├── app.routes.ts          # Definición de rutas
└── app.config.ts          # Configuración global (providers)
```

Comando usado:
```bash
mkdir -p src/app/pages src/app/components src/app/models src/app/services
mkdir -p src/app/core/guards src/app/core/interceptors
mkdir -p src/app/directives src/app/pipes
```

**¿Por qué esta estructura?** Separa "qué se ve" (pages, components) de "cómo funciona" (services, models) y de "reglas transversales" (core). Así, cuando el proyecto crezca, es fácil saber dónde buscar cada cosa.

## 3. Verificar `app.config.ts` y `main.ts`

El CLI ya los genera correctamente en esta versión de Angular, pero es importante entender qué hace cada uno:

**`app.config.ts`** — configuración global de la app. Aquí se registran todos los "providers" (router, HttpClient, interceptores, etc.):
```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```

**`main.ts`** — el punto de arranque de la app. Solo importa `appConfig` y arranca:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

## 4. Primer componente y ruta

```bash
ng g c pages/home
```

`app.component.html` (punto donde Angular inserta la página activa):
```html
<router-outlet />
```

`app.routes.ts` (mapea la URL con el componente):
```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }
];
```

**Comprobación:** `ng serve` → abrir `http://localhost:4200` → debe mostrarse el contenido de `HomeComponent`.

## 5. Prettier — formateo automático del código

**¿Para qué sirve?** Da formato uniforme al código automáticamente (comillas, punto y coma, indentación...) para que todo el equipo escriba con el mismo estilo, sin discutirlo.

```bash
npm install --save-dev prettier
```

`.prettierrc` (reglas de formato):
```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "none"
}
```

`.prettierignore` (carpetas que Prettier no debe tocar):
```
dist
node_modules
coverage
```

## 6. ESLint — detección de errores y malas prácticas

**¿Para qué sirve?** Analiza el código en busca de errores, código muerto o patrones desaconsejados (a diferencia de Prettier, que solo da formato, ESLint revisa la *calidad* del código).

```bash
ng add @angular-eslint/schematics
```

Este único comando ya deja todo configurado: crea `eslint.config.js` con las reglas recomendadas y añade el comando de lint al proyecto. No hace falta tocar nada más a mano.

> **Nota de versión:** en guías antiguas se menciona un archivo `.eslintrc.json`. Ese formato quedó obsoleto con ESLint 9 (el que usa esta versión de Angular); ahora se usa `eslint.config.js`, que se genera solo con el comando de arriba.

## 7. Scripts añadidos a `package.json`

```json
"scripts": {
  "lint": "ng lint",
  "format": "prettier --write ."
}
```

- `npm run lint` → revisa errores de código.
- `npm run format` → formatea todo el proyecto con Prettier.

## 8. Husky + lint-staged — bloquear commits con errores

**¿Para qué sirve?** Husky ejecuta comandos automáticamente en momentos concretos de Git (por ejemplo, justo antes de un commit). Combinado con `lint-staged` (que aplica lint/formato solo a los archivos que se van a subir, no a todo el proyecto), evita que se suba código sin revisar.

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Esto crea automáticamente:
- La carpeta `.husky/` con un archivo `pre-commit`.
- El script `"prepare": "husky"` en `package.json` (así, si otra persona clona el proyecto, los hooks se activan solos al hacer `npm install`).

Se editó `.husky/pre-commit` para que ejecute:
```
npx lint-staged
```

Y se añadió esta configuración en `package.json`:
```json
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.html": ["prettier --write"]
}
```

### Flujo diario resultante

1. Se escribe código normal.
2. `git add .` y `git commit -m "mensaje"`.
3. Husky dispara `pre-commit` → `lint-staged` revisa **solo** los archivos que se van a commitear.
4. Si todo está bien, formatea automáticamente y el commit se completa.
5. Si ESLint encuentra un error que no puede arreglar solo, el commit se bloquea hasta corregirlo.

## 9. Comprobación de que todo funciona

```bash
npm run lint
npm run format
git add .
git commit -m "chore: setup inicial con prettier, eslint y husky"
```

Si el commit se completa sin bloqueos, la configuración es correcta.

---

## Próximos pasos (pendiente de documentar)

- [ ] Servicios + `HttpClient`
- [ ] `json-server` como backend simulado
- [ ] Guards e Interceptores
- [ ] Formularios reactivos
