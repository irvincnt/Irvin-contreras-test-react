# Guía de Instalación

Esta guía te ayudará a instalar y ejecutar el proyecto paso a paso.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
  - Puedes descargar Node.js desde: https://nodejs.org/
  - Verifica la instalación: `node --version`

- **npm** (viene con Node.js)
  - Verifica la instalación: `npm --version`

## Pasos de Instalación

### 1. Clonar o acceder al proyecto

```bash
cd /Users/irvincontreras/Documents/Projects/irvin-contreras-react-test
```

### 2. Instalar todas las dependencias

Opción recomendada (instala todo de una vez):

```bash
npm run install-all
```

O instalar manualmente cada aplicación:

```bash
# Dependencias de la raíz
npm install

# Dependencias del host
cd host
npm install
cd ..

# Dependencias de Rick & Morty
cd remotes/rick-morty
npm install
cd ../..

# Dependencias de Products
cd remotes/products
npm install
cd ../..

# Dependencias de Upload
cd remotes/upload
npm install
cd ../..
```

### 3. Iniciar la aplicación

Para iniciar todas las aplicaciones simultáneamente:

```bash
npm start
```

Esto iniciará:
- **Host** en http://localhost:3000
- **Rick & Morty** en http://localhost:3001
- **Products** en http://localhost:3002
- **Upload** en http://localhost:3003

### 4. Acceder a la aplicación

1. Abre tu navegador en: http://localhost:3000
2. Inicia sesión con las credenciales de prueba:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
3. Explora las diferentes secciones de la aplicación

## Iniciar Aplicaciones Individualmente

Si prefieres iniciar las aplicaciones una por una:

```bash
# En la raíz del proyecto, en diferentes terminales:

# Terminal 1 - Host
npm run start:host

# Terminal 2 - Rick & Morty
npm run start:rick-morty

# Terminal 3 - Products
npm run start:products

# Terminal 4 - Upload
npm run start:upload
```

**Importante**: Para que Module Federation funcione correctamente, el host necesita que todos los remotes estén ejecutándose.

## Compilar para Producción

Para crear una build de producción:

```bash
npm run build
```

Esto compilará todas las aplicaciones en sus respectivas carpetas `dist/`.

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Elimina node_modules y reinstala
rm -rf node_modules host/node_modules remotes/*/node_modules
npm run install-all
```

### Error: "Port already in use"
Si algún puerto está ocupado, puedes:
1. Detener el proceso que está usando el puerto
2. O modificar el puerto en el archivo `webpack.config.js` correspondiente

### Error de CORS
Asegúrate de que todos los servidores estén ejecutándose antes de acceder al host.

## Scripts Disponibles

Desde la raíz del proyecto:

- `npm start` - Inicia todas las aplicaciones
- `npm run build` - Compila todas las aplicaciones
- `npm run start:host` - Inicia solo el host
- `npm run start:rick-morty` - Inicia solo Rick & Morty
- `npm run start:products` - Inicia solo Products
- `npm run start:upload` - Inicia solo Upload

## Siguiente Paso

Una vez que la aplicación esté ejecutándose, revisa el [README.md](./README.md) para conocer más sobre la arquitectura y funcionalidades del proyecto.

¡Disfruta desarrollando! 🚀

