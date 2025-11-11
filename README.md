# LINGOverse (Reto 1 - DAW)

Este proyecto es una implementación del juego Lingo construido con Laravel 12 y Docker, siguiendo los requisitos del reto de 1ª Evaluación.

La rama `main` contiene la configuración inicial y la rama `dev` contiene la integración del juego y el sistema de ranking.

-----

## Prerrequisitos

  * **Docker Desktop**

-----

## Instrucciones de Puesta en Marcha (Desde Cero)

Esta guía es para levantar el proyecto completo (rama `dev`) en un nuevo entorno.

### 1\. Clonar y Levantar Contenedores

1.  **Clonar el Repositorio**
    ```bash
    git clone https://github.com/ikcdv23/LINGO-Javier-Alcate.git
    cd LINGO-Javier-Alcate
    ```
2.  **Cambiar a la Rama de Desarrollo**
    ```bash
    git checkout dev
    ```
3.  **Levantar TODOS los Contenedores**
    ```bash
    docker-compose up -d --build
    ```
    *(Espera \~1 minuto a que todos los contenedores arranquen. El contenedor `laravel-vite` ejecutará `npm install` y `npm run dev` por ti).*

### 2\. Configuración de Laravel y Base de Datos (¡CRÍTICO\!)

#### IMPORTANTE: Modificar el Archivo `.env`

Por defecto, Laravel usa SQLite y no se conectará a MySQL. **Debes hacer este paso inmediatamente después del Paso 4.**

1.  **Copiar el archivo de ejemplo:**

    ```bash
    docker-compose exec web cp .env.example .env
    ```

2.  **Abrir `src/.env` y modificar la conexión de base de datos** para que use MySQL y apunte a tu servicio `db`. Asegúrate de que las líneas de `DB_HOST`, `DB_PORT`, etc., **NO** empiecen con `#`.

    ```dotenv
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=laravel_db
    DB_USERNAME=root # Usar 'root' para phpMyAdmin o 'user' para la aplicación
    DB_PASSWORD=root_password_segura

    # Asegúrate de que la línea de abajo también apunta a la base de datos
    SESSION_DRIVER=database
    ```

#### 🛠️ Pasos Finales de Instalación

1.  **Generar la Clave de la Aplicación**
    ```bash
    docker-compose exec web php artisan key:generate
    ```
2.  **Instalar Dependencias de PHP (Composer)**
    ```bash
    docker-compose exec web composer install
    ```
3.  **Ejecutar las Migraciones**
    Crea todas las tablas en la base de datos (`users`, `palabras`, `partidas`, etc.).
    ```bash
    docker-compose exec web php artisan migrate
    ```
4.  **Limpiar la Caché de Configuración**
    Este paso es **obligatorio** para que Laravel olvide el modo SQLite y use MySQL.
    ```bash
    docker-compose exec web php artisan config:clear
    ```

### 3\. Poblar el Diccionario (Paso Manual)

La tabla `palabras` está vacía. Vamos a llenarla.

1.  Abre phpMyAdmin en tu navegador: **`http://localhost:8080`**
2.  Inicia sesión:
      * **Servidor:** `db`
      * **Usuario:** `root`
      * **Contraseña:** `root_password_segura`
3.  En la lista de la izquierda, haz clic en la base de datos **`laravel_db`**.
4.  Ve a la pestaña **"Importar"**.
5.  Haz clic en "Seleccionar archivo" y busca el archivo `5_insertPalabras.sql` en tu proyecto.
6.  Baja y haz clic en **"Importar"**.

-----

## ¡Listo\!

Ya está todo funcionando:

  * **Aplicación Lingo:** `http://localhost`
  * **Gestor de BBDD:** `http://localhost:8080`

*(No necesitas ejecutar `npm run dev`, el contenedor `laravel-vite` ya lo está haciendo por ti.)*
