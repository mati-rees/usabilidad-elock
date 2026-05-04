# Elock — Dashboard de Usabilidad

Dashboard moderno para analizar mensualmente la usabilidad de los lockers inteligentes Elock. Cargá archivos mensuales de retiros, visualizá métricas en tiempo real y seguí el histórico de tus clientes.

## Características

✅ **Carga mensual automática** — Importá archivos Excel/CSV con retiros del mes  
✅ **Fuzzy matching inteligente** — Detecta automáticamente variaciones en nombres de clientes  
✅ **Histórico acumulativo** — Mantiene datos de todos los meses para comparativas  
✅ **Alertas visuales** — Status color-coded (verde/gris/amarillo/rojo) según rendimiento  
✅ **4 tabs navegables** — Dashboard, Clientes, Cargar, Historial  
✅ **Exportación flexible** — Descargá datos en JSON o CSV  
✅ **Marca Elock** — Diseño con colores corporativos (amarillo, negro, teal)

## Uso

### 1. Abrir el Dashboard

Simplemente abre `index.html` en tu navegador. No necesita servidor ni instalación.

```bash
# En Windows, haz doble click en index.html
# O arrastra el archivo a tu navegador
```

### 2. Cargar Datos del Mes

**Tab: Cargar**

1. **Seleccionar archivo:** Arrastra tu Excel/CSV o hacé click para seleccionar  
   - Aceptamos `.xlsx`, `.csv`, `.xls`
   - Estructura esperada: Cliente, Tipo Empresa, Creado

2. **Seleccionar mes:** Indicá el mes que corresponde (ej: Mayo 2026)

3. **Revisar coincidencias:** El sistema sugiere qué clientes mergear  
   - Verde: Merge con cliente existente (>80% coincidencia)
   - Amarillo: Crear como nuevo cliente
   - Podés cambiar la decisión haciendo click

4. **Importar:** Confirmá y los datos se guardan automáticamente

### 3. Ver el Dashboard

**Tab: Dashboard**

- **KPIs:** Total retiros, clientes activos, promedio, cambio %
- **Gráfico:** Tendencia de últimos 12 meses
- **Tabla de clientes:** Estado actual con alertas
  - Verde (≥70% del promedio)
  - Gris (50-70%)
  - Amarillo (30-50%)
  - Rojo (<30%)

### 4. Analizar Clientes

**Tab: Clientes**

- Listado de todos los clientes con histórico
- Retiros del mes actual, promedio histórico, cantidad de meses registrados
- Click en "Ver" para detalles

### 5. Revisar Historial

**Tab: Historial**

- Tabla mensual completa
- Descargá datos en:
  - **JSON:** Backup completo con toda la estructura
  - **CSV:** Tabla de meses × clientes para abrir en Excel

## Estructura de Datos

Los datos se guardan en **LocalStorage** del navegador (no en la nube).

**Ubicación:** `localStorage['elock_usability_data']`

**Estructura:**
```json
{
  "metadata": {
    "lastUpdated": "2026-05-04T14:30:00Z",
    "monthsLoaded": ["2026-01", "2026-02", "2026-03"]
  },
  "clients": {
    "edificio_vista_san_martin": {
      "id": "edificio_vista_san_martin",
      "displayName": "Edificio Vista San Martín",
      "type": "residencial",
      "monthlyData": {
        "2026-01": 17,
        "2026-02": 34,
        "2026-03": 46
      },
      "historicalAvg": 32.3,
      "createdAt": "2026-01-15T12:00:00Z",
      "aliases": []
    }
  },
  "mergeHistory": []
}
```

## Subir a GitHub

Como este es un archivo HTML único, podés versionarlo directamente:

```bash
cd C:\Users\matia\Desktop\Elock\Proyectos\Usabilidad
git init
git add .
git commit -m "Initial Elock usability dashboard"
git remote add origin https://github.com/tu-usuario/elock-usabilidad.git
git push -u origin main
```

**Nota:** Los datos se guardan localmente en el navegador. Para compartir datos entre máquinas, exportá como JSON y compartí el archivo.

## Cálculo de Métricas

### Promedio Histórico
```
historicalAvg = Suma de todos los retiros del cliente / Cantidad de meses
```

### Status / Alerta
```
percentOfAvg = (Retiros del mes / Promedio histórico) × 100

if percentOfAvg >= 70: Verde
else if percentOfAvg >= 50: Gris
else if percentOfAvg >= 30: Amarillo
else: Rojo
```

### Cambio Mes a Mes
```
change = (Retiros actuales - Retiros mes anterior) / Retiros mes anterior × 100
```

## Formatos de Archivo Aceptados

### Excel (.xlsx)
| Cliente | Tipo Empresa | Creado |
|---------|-------------|--------|
| Edificio Fray Camilo-AP | residencial | 30/04/2026 15:23 |
| Edificio Cantagallo | residencial | 30/04/2026 19:13 |

### CSV (.csv)
```csv
Cliente,Tipo Empresa,Creado
Edificio Fray Camilo-AP,residencial,30/04/2026 15:23
Edificio Cantagallo,residencial,30/04/2026 19:13
```

## Solución de Problemas

**P: ¿Dónde se guardan los datos?**  
R: En LocalStorage del navegador. Aparecen cada vez que abres el dashboard. Si limpias el caché del navegador, se pierden. Descargá JSON regularmente como backup.

**P: ¿Puedo usar esto en otra máquina?**  
R: Sí. Descargá los datos como JSON, luego copia el contenido y pegá en la consola del navegador:
```javascript
localStorage.setItem('elock_usability_data', '{"metadata":{...}}')
```

**P: ¿Qué pasa si cargo el mismo mes dos veces?**  
R: El segundo intento overwritea los datos del primer mes. Hazlo con cuidado.

**P: ¿Funciona sin internet?**  
R: Sí, completamente offline después de la carga inicial.

## Licencia

Privado — Elock

## Contacto

Para soporte o feature requests, contactá al equipo de Elock.
