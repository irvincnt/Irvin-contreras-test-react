# React 19 + Tailwind CSS + Module Federation

Este proyecto es una aplicación web desarrollada con **React 19**, **Tailwind CSS** y **Webpack Module Federation**, que demuestra una arquitectura de micro-frontends con múltiples aplicaciones independientes.

## 🏗️ Arquitectura

El proyecto está estructurado como un monorepo con las siguientes aplicaciones:

### Host (Puerto 3000)

- **Aplicación principal** que coordina todos los módulos remotos
- Sistema de **autenticación con login**
- Navegación entre las diferentes secciones
- Credenciales de prueba: `irvin@gmail.com / testReact25@`

### Remotes (Módulos Federados)

1. **Rick & Morty** (Puerto 3001)

   - Ruta: `/rick-morty`
   - Muestra personajes de la API de Rick and Morty
   - Paginación y filtrado de personajes

2. **Products** (Puerto 3002)

   - Rutas: `/products/` `/product/:id` `/create-producto`
   - Vistas: Tabla de productos, detalle de producto y formulario para la creción de productos
   - Filtro de productos por nombre

3. **Upload** (Puerto 3003)
   - Ruta: `/upload`
   - Sistema de carga de archivos
   - Drag & drop functionality
   - Gestión de archivos múltiples

## 🚀 Instalación

### Requisitos Previos

- Node.js (v18 o superior)
- npm

### Instalación de Dependencias

```bash
# Instalar todas las dependencias del monorepo
npm run install-all
```

O instalación manual:

```bash
# En la raíz
npm install

# En host
cd host && npm install && cd ..

# En cada remote
cd remotes/rick-morty && npm install && cd ../..
cd remotes/products && npm install && cd ../..
cd remotes/upload && npm install && cd ../..
```

### Pasos rápidos tras clonar el repositorio

1. Clona el proyecto o descárgalo en tu máquina.
2. Ejecuta `npm run install-all` desde la raíz para instalar todas las dependencias.
3. Crea los archivos `.env` necesarios (ver sección "Puesta en marcha").
4. Inicia las aplicaciones con `npm start` o con los scripts individuales.

## 🎮 Uso

### Iniciar todas las aplicaciones simultáneamente

```bash
npm start
```

Este comando inicia todas las aplicaciones en paralelo:

- Host: http://localhost:3000
- Rick & Morty: http://localhost:3001
- Products: http://localhost:3002
- Upload: http://localhost:3003

### Iniciar aplicaciones individualmente

```bash
# Host
npm run start:host

# Rick & Morty
npm run start:rick-morty

# Products
npm run start:products

# Upload
npm run start:upload
```

## ▶️ Puesta en marcha

### Desarrollo local

1. **Instalar dependencias**: `npm run install-all`.
2. **Variables de entorno**:
   - Crea un archivo `.env` en cada paquete si necesitas sobrescribir los valores por defecto.
   - Ejemplo para el host (`host/.env`):

```bash
AUTH_STORAGE_SECRET=dev-super-secreto
HOST_URL=http://localhost:3000/
REMOTE_RICK_MORTY_URL=http://localhost:3001/remoteEntry.js
REMOTE_PRODUCTS_URL=http://localhost:3002/remoteEntry.js
REMOTE_UPLOAD_URL=http://localhost:3003/remoteEntry.js
```

- Ejemplo para un remote (`remotes/rick-morty/.env`):

```bash
HOST_REMOTE_URL=http://localhost:3000/remoteEntry.js
PUBLIC_PATH=http://localhost:3001/
```

3. **Levantar los servidores**:
   - `npm start` ejecuta host y remotes en paralelo.
   - También puedes abrir cuatro terminales y usar los scripts `npm run start:<app>` para cada proyecto.
4. **Acceder**: abre `http://localhost:3000`, inicia sesión con `irvin@gmail.com / testReact25@` y navega entre los módulos.

### Preparación para producción

1. **Configurar variables de entorno**:
   - Crea archivos `.env.production` en cada paquete con las URL reales que usarás al desplegar.
   - Ejemplo para el host (`host/.env.production`):

```bash
AUTH_STORAGE_SECRET=clave-ultra-secreta
REMOTE_RICK_MORTY_URL=https://cdn.midominio.com/rick-morty/remoteEntry.js
REMOTE_PRODUCTS_URL=https://cdn.midominio.com/products/remoteEntry.js
REMOTE_UPLOAD_URL=https://cdn.midominio.com/upload/remoteEntry.js
```

- Ejemplo para un remote (`remotes/rick-morty/.env.production`):

```bash
HOST_REMOTE_URL=https://app.midominio.com/remoteEntry.js
PUBLIC_PATH=https://cdn.midominio.com/rick-morty/
```

- Repite la configuración de `HOST_REMOTE_URL` y `PUBLIC_PATH` para cada remote, apuntando a las rutas públicas definitivas donde se servirá su `remoteEntry.js`.

2. **Generar los bundles de producción**:

```bash
npm run build
```

- Este comando ejecuta los builds en `host/dist`, `remotes/rick-morty/dist`, `remotes/products/dist` y `remotes/upload/dist`.

3. **Publicar los artefactos**:
   - Sirve el contenido de `host/dist` detrás de tu dominio principal (por ejemplo, en un servicio como Vercel, Netlify o Nginx).
   - Publica cada carpeta `dist` de los remotes en el dominio/CDN configurado en `PUBLIC_PATH`. Asegúrate de que los archivos `remoteEntry.js` sean accesibles públicamente.
4. **Verificación**:
   - Con las builds listas, puedes probar localmente ejecutando `npx serve host/dist` y apuntando las variables `REMOTE_*_URL` a la ruta que entrega `serve`.
   - Comprueba en producción que cada remote responde correctamente y que las rutas principales cargan sin errores en la consola del navegador.

## 🏗️ Build para Producción

```bash
# Build de todas las aplicaciones
npm run build

# Build individual
npm run build:host
npm run build:rick-morty
npm run build:products
npm run build:upload
```

## 📁 Estructura del Proyecto

```
irvin-contreras-react-test/
├── host/                          # Aplicación host principal
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx        # Layout con navegación
│   │   ├── pages/
│   │   │   └── Login.jsx         # Página de login
│   │   ├── App.jsx               # App principal
│   │   ├── index.js
│   │   └── index.css
│   ├── webpack.config.js         # Configuración de Module Federation
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── remotes/
│   ├── rick-morty/               # Remote: Rick & Morty
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   ├── webpack.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── products/                 # Remote: Products
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── CreateProduct.jsx
│   │   │   ├── App.jsx
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   ├── webpack.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── upload/                   # Remote: Upload
│       ├── public/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── index.js
│       │   └── index.css
│       ├── webpack.config.js
│       ├── tailwind.config.js
│       └── package.json
│
├── package.json                  # Package.json raíz
├── .gitignore
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **React 19**: Framework de JavaScript para interfaces de usuario
- **Tailwind CSS**: Framework de CSS utility-first
- **Webpack 5**: Bundler con Module Federation
- **React Router v6**: Enrutamiento para React
- **PostCSS**: Procesador de CSS
- **Babel**: Transpilador de JavaScript

## 🎨 Características

### Module Federation

- Carga dinámica de módulos remotos
- Compartición de dependencias (React, React-DOM, React Router)
- Desarrollo independiente de cada módulo
- Hot Module Replacement (HMR) en desarrollo

### Diseño

- UI moderna y responsiva con Tailwind CSS
- Animaciones y transiciones suaves
- Componentes reutilizables
- Diseño mobile-first

### Funcionalidades

- Sistema de autenticación
- Navegación entre módulos
- API integration (Rick and Morty API)
- Gestión de estado local
- LocalStorage para persistencia

## 📝 Notas de Desarrollo

### Module Federation Configuration

Cada aplicación tiene su configuración de Webpack con Module Federation:

- **Host**: Consume los tres remotes
- **Remotes**: Exponen sus componentes principales

### Shared Dependencies

Las dependencias compartidas entre host y remotes:

- `react` (singleton)
- `react-dom` (singleton)
- `react-router-dom` (singleton)

### Puertos

- Host: 3000
- Rick & Morty Remote: 3001
- Products Remote: 3002
- Upload Remote: 3003

## 🐛 Troubleshooting

### Error de CORS

Si encuentras errores de CORS, asegúrate de que todos los servidores de desarrollo estén ejecutándose.

### Error de Module Federation

Si un remote no se carga, verifica que:

1. El servidor del remote esté ejecutándose
2. El puerto esté disponible
3. La configuración de `remoteEntry.js` sea correcta

### Problemas con las dependencias

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules host/node_modules remotes/*/node_modules
npm run install-all
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Irvin Contreras

---

¡Disfruta explorando el proyecto! 🚀
