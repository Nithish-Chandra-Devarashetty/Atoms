# Certificate System Setup

## Quick Setup Guide

### 1. Configure Cloudinary
1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Update `server/.env` with your Cloudinary details:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 2. Place Certificate Assets
- Make sure `Certificate.pdf` and `ai.png` are in the root `D:\zuno` folder
- The system will automatically use these for certificate generation

### 3. Test the System
1. Start the backend: `cd server && npm run dev`
2. Start the frontend: `cd .. && npm run dev`
3. Complete all 6 WebDev modules (HTML, CSS, JavaScript, React, Node.js, MongoDB)
4. Visit your Profile page - you should see a "Download Certificate" button when 100% complete

## How it Works

### Completion Requirements:
- **All 6 modules**: HTML, CSS, JavaScript, React, Node.js, MongoDB
- **Per module**: Watch all 11 videos + pass required quizzes
- **Single-quiz subjects** (HTML, CSS): Pass the main quiz
- **Multi-quiz subjects** (JS, React, Node, MongoDB): Pass at least one quiz per subject

### Certificate Features:
- **Dynamic PDF generation** with user name and completion date
- **Cloud storage** via Cloudinary for reliable downloads
- **Unique certificate IDs** for verification
- **Badge system** integration (adds "webdev-certificate" badge)
- **Anti-duplicate** protection (can't generate multiple certs for same course)

### API Endpoints:
- `POST /api/certificates/webdev/generate` - Generate certificate
- `GET /api/certificates/user` - Get user's certificates
- `GET /api/certificates/webdev/eligibility` - Check if eligible
- `GET /api/certificates/verify/:id` - Public verification

### Frontend Integration:
- Certificate section in Profile page
- Real-time eligibility checking
- One-click download when eligible
- Certificate gallery for earned certificates

## Troubleshooting

### Common Issues:
1. **"Certificate template not found"**: Ensure `Certificate.pdf` is in `D:\zuno`
2. **"Logo not found"**: Ensure `ai.png` is in `D:\zuno`
3. **"Upload failed"**: Check Cloudinary credentials in `.env`
4. **"Not eligible"**: Complete all 6 modules (66 videos + required quizzes)

### Development Notes:
- PDF coordinates may need adjustment based on your template design
- Logo scaling can be adjusted in `certificateGenerator.ts`
- Completion criteria can be customized in the controller
- Certificate design is dynamically overlaid on your template

## Future Enhancements:
- Certificates for Core CS, DSA, and Aptitude
- Email delivery of certificates
- Social sharing features
- Certificate expiration/renewal
- Batch certificate generation for organizations
