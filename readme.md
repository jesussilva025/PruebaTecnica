# Sistema de Productos con Descuentos · Angular 18

Aplicación Angular 18 standalone con **Signals**, **RxJS**, **TailwindCSS** y arquitectura limpia.
Lista productos desde una API pública y aplica descuentos automáticamente por categoría.

---

## 🚀 Stack

- Angular 18+ (standalone components, signals, control flow `@if/@for`)
- TypeScript estricto
- RxJS · HttpClient con interceptor centralizado
- TailwindCSS (dark mode automático)
- Diseño minimalista estilo Stripe / Linear / Vercel
- `lucide-angular` para iconografía

---

## 📦 Instalación

```bash
npm install
npm start
```

Abre `http://localhost:4200`.

Para producción:

```bash
npm run build
# Output: dist/products-discounts/browser
```

---

## 🧱 Arquitectura

```
src/app/
├── core/
│   ├── config/api.config.ts          # Endpoints centralizados
│   ├── interceptors/error.interceptor.ts
│   └── services/theme.service.ts     # Dark mode con signals
├── shared/                           # Componentes/utilidades reutilizables
└── features/
    └── products/
        ├── components/
        │   ├── navbar.component.ts
        │   ├── product-card.component.ts        (Dumb / presentational)
        │   ├── product-list.component.ts        (Dumb)
        │   ├── product-skeleton.component.ts
        │   ├── empty-state.component.ts
        │   └── error-state.component.ts
        ├── services/product.service.ts          (Capa de datos)
        ├── models/product.model.ts              (Interfaces estrictas)
        ├── utils/discount.util.ts               (Lógica pura reutilizable)
        └── pages/products-page.component.ts     (Smart container)
```

Principios aplicados: **SOLID**, **Separation of Concerns**, **Smart/Dumb components**,
**OnPush change detection**, **standalone components**, **typed signals**, **computed values**,
y `trackBy` implícito en `@for`.

---

## 🔁 Modelo de datos

```ts
interface Product {
  id: number;
  name: string;        // <- mapeado desde `title` de la API
  price: number;
  category: string;
  image: string;
  description: string;
  discount: number;
  finalPrice: number;
}
```

## 💸 Lógica de descuentos

```ts
finalPrice = price - (price * discount / 100)
```

Tabla local (simulando backend) en `utils/discount.util.ts`:

```ts
{ category: 'electronics',    discount: 10 }
{ category: 'jewelery',       discount:  5 }
{ category: "men's clothing", discount: 15 }
```

El precio original **nunca** se modifica; `finalPrice` se calcula al transformar la respuesta.

---

## 🔌 Migración a tu backend real

Toda la configuración vive en **`src/environments/*`** y **`src/app/core/config/api.config.ts`**.

```ts
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://<tu-api-gateway>.execute-api.<region>.amazonaws.com/prod',
};
```

Si el contrato del backend cambia (no devuelve `title` sino `name`), ajusta
únicamente `ProductService.toProduct(...)`. El resto del sistema permanece intacto.

---

## ☁️ Despliegue en AWS

### Frontend → S3 + CloudFront

```bash
npm run build
aws s3 sync dist/products-discounts/browser s3://<bucket> --delete
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

Configura el bucket S3 como *static website hosting* y CloudFront como CDN
con HTTPS y un `default root object = index.html`. Recuerda agregar la regla
de SPA redirect (errores 403/404 → `/index.html` con código 200).

### Backend → AWS Lambda + API Gateway + RDS (MySQL)

1. **Lambda**: implementa el endpoint `GET /products` (Node.js 20).
2. **API Gateway**: expone la Lambda con CORS habilitado para el dominio CloudFront.
3. **RDS (MySQL)**: tabla `products(id, title, price, category, image, description)`.
4. Pega el dominio API Gateway en `environment.prod.ts → apiUrl`.

> Opcional: EC2 + Nginx si requieres procesos persistentes (WebSocket, jobs).

---

## ✅ Features incluidos

- Búsqueda en vivo
- Filtros por categoría
- Ordenamiento por precio
- Loading skeletons
- Empty / Error states + botón **Reintentar**
- Dark mode automático (respeta preferencia del SO + toggle manual)
- Responsive: mobile / tablet / desktop
- Lazy loading de rutas e imágenes
- Interceptor HTTP centralizado para errores
- Formato de moneda **MXN** (Intl)
- Animaciones y transiciones suaves
