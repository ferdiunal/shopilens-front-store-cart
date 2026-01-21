# Shopilens Store Cart

Bu proje, **Shopilens** e-ticaret platformunun sepet ve ödeme işlemlerini yöneten **Micro-Frontend** servisidir. Next.js 16 altyapısı üzerine kurulmuş olup, modern web teknolojilerini ve güvenlik standartlarını destekler.

## 🛠 Teknoloji Yığını

- **Framework**: Next.js 16.1.4 (React 19)
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS v4, Radix UI
- **Authentication**: NextAuth.js v4, Auth0
- **Internationalization**: next-intl
- **Containerization**: Docker (Multi-stage build)

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamda çalıştırmak için aşağıdaki adımları izleyin:

### Gerekli Bağımlılıklar
- Node.js 20+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükleyin
npm install
```

### Geliştirme Modu

```bash
# Projeyi geliştirme modunda başlatın
npm run dev
# Uygulama http://localhost:3001 adresinde çalışacaktır (varsayılan)
```

### Production Build

```bash
npm run build
PORT=3001 npm start
```

## 🐳 Docker Deployment

Proje, multi-stage Docker build yapısına sahiptir. Bu sayede image boyutu optimize edilmiştir.

```bash
# Docker image oluşturma
docker build -t shopilens-store-cart .

# Docker container başlatma (3001 portunda)
docker run -p 3001:3001 shopilens-store-cart
```

> **Not:** Dockerfile içerisinde `EXPOSE 3001` ve `ENV PORT 3001` ayarları bulunmaktadır. Production ortamında port 3001 üzerinden hizmet verir.

## 🔑 Çevresel Değişkenler (.env)

Projenin kök dizininde `.env` dosyası oluşturun. `.env.example` dosyasını referans alabilirsiniz.

### Temel Konfigürasyon
| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_APP_URL` | Uygulamanın çalışacağı ana URL (örn: https://your-domain.com) |
| `NEXT_PUBLIC_API_URL` | Backend API adresi (örn: https://fakestoreapi.com) |

### Auth0 Entegrasyonu
Auth0 entegrasyonu için gerekli anahtarlar. `Regular Web App` tipinde bir uygulama oluşturulmalıdır.

| Değişken | Açıklama |
|----------|----------|
| `AUTH0_SECRET` | Session şifreleme anahtarı (`openssl rand -hex 32` ile oluşturulabilir) |
| `AUTH0_BASE_URL` | Uygulamanın base URL'i (Development: http://localhost:3001) |
| `AUTH0_ISSUER_BASE_URL` | Auth0 Tenant Domain (örn: https://dev-xyz.us.auth0.com) |
| `AUTH0_CLIENT_ID` | Auth0 Application Client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 Application Client Secret |

### NextAuth Konfigürasyonu
| Değişken | Açıklama |
|----------|----------|
| `NEXTAUTH_URL` | NextAuth için canonical URL (Genellikle `AUTH0_BASE_URL` ile aynı) |
| `NEXTAUTH_SECRET` | NextAuth güvenlik anahtarı (`openssl rand -base64 32`) |

### Diğer Servisler
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager ID
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID
- `NEXT_PUBLIC_ENABLE_CART`: Sepet özelliğini açıp kapatmak için Feature Flag

## 🔐 Auth0 Entegrasyonu Detayları

Proje, kimlik doğrulama için **NextAuth.js** ile **Auth0 Provider** kullanmaktadır. İlgili konfigürasyon `lib/auth/auth.ts` dosyasında yer alır.

### Yapılandırma Adımları:

1.  **Auth0 Dashboard**: Bir "Regular Web App" oluşturun.
2.  **callback URLs**: "Allowed Callback URLs" alanına aşağıdaki adresleri ekleyin:
    *   `http://localhost:3001/api/auth/callback/auth0` (Local)
    *   `https://your-production-domain.com/api/auth/callback/auth0` (Production)
3.  **Logout URLs**: "Allowed Logout URLs" alanına:
    *   `http://localhost:3001`
    *   `https://your-production-domain.com`
4.  **Credentials**: Client ID, Client Secret ve Domain bilgilerini `.env` dosyasına ekleyin.

`lib/auth/auth.ts` dosyası, ortam değişkenlerini kontrol eder ve eğer Auth0 bilgileri mevcutsa Auth0 Provider'ı aktif eder. Aksi takdirde Google veya Credentials provider'ları fallback olarak çalışabilir (konfigüre edilmişse).

## 🌍 Multi-Zone & Rewrites

Bu proje, ana uygulama (`shopilens-store`) ile entegre çalışacak şekilde tasarlanmıştır. `next.config.ts` dosyasında, belirli path'ler veya statik dosyalar için yönlendirmeler (rewrites) tanımlanmış olabilir.

```typescript
// Örnek rewrite kuralı
{
  source: '/:lang',
  destination: 'http://localhost:3001/:lang',
}
```
Bu kurallar, Micro-Frontend mimarisinde path routing'in doğru çalışmasını sağlar.
