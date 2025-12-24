/**
 * Certificate Generator for Prize2Pride Platform
 * Generates downloadable PDF certificates for course completion
 */

interface CertificateData {
  userName: string;
  lessonTitle: string;
  level: string;
  completionDate: Date;
  score: number;
  xpEarned: number;
  certificateId: string;
}

/**
 * Generate HTML template for certificate
 */
function generateCertificateHTML(data: CertificateData): string {
  const formattedDate = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    
    .certificate {
      width: 800px;
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 20px;
      padding: 60px;
      position: relative;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 3px solid #c9a227;
      border-radius: 15px;
      pointer-events: none;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #c9a227 0%, #f4d03f 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 36px;
    }
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 4px;
    }
    
    .content {
      text-align: center;
      margin: 40px 0;
    }
    
    .presented-to {
      font-size: 14px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 15px;
    }
    
    .name {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 600;
      color: #c9a227;
      margin-bottom: 30px;
      text-decoration: underline;
      text-decoration-color: #c9a227;
      text-underline-offset: 10px;
    }
    
    .achievement {
      font-size: 18px;
      color: #333;
      line-height: 1.8;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .lesson-title {
      font-weight: 600;
      color: #1a1a2e;
    }
    
    .level-badge {
      display: inline-block;
      padding: 8px 20px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      margin: 20px 0;
    }
    
    .stats {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin: 40px 0;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      color: #c9a227;
    }
    
    .stat-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 5px;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #eee;
    }
    
    .date {
      font-size: 14px;
      color: #666;
    }
    
    .signature {
      text-align: center;
    }
    
    .signature-line {
      width: 200px;
      border-bottom: 2px solid #333;
      margin-bottom: 10px;
    }
    
    .signature-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-style: italic;
    }
    
    .signature-title {
      font-size: 12px;
      color: #888;
    }
    
    .certificate-id {
      font-size: 10px;
      color: #aaa;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">✨</div>
      <h1 class="title">Prize2Pride</h1>
      <p class="subtitle">Certificate of Achievement</p>
    </div>
    
    <div class="content">
      <p class="presented-to">This certificate is proudly presented to</p>
      <h2 class="name">${data.userName}</h2>
      <p class="achievement">
        For successfully completing the course<br>
        <span class="lesson-title">"${data.lessonTitle}"</span>
      </p>
      <div class="level-badge">Level ${data.level}</div>
    </div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${data.score}%</div>
        <div class="stat-label">Final Score</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.xpEarned}</div>
        <div class="stat-label">XP Earned</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="date">
        Issued on ${formattedDate}
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <p class="signature-name">Manus AI</p>
        <p class="signature-title">Platform Director</p>
      </div>
      <div class="certificate-id">
        Certificate ID: ${data.certificateId}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate a unique certificate ID
 */
function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `P2P-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate certificate data for a completed lesson
 */
export function createCertificateData(
  userName: string,
  lessonTitle: string,
  level: string,
  score: number,
  xpEarned: number
): CertificateData {
  return {
    userName,
    lessonTitle,
    level,
    completionDate: new Date(),
    score,
    xpEarned,
    certificateId: generateCertificateId()
  };
}

/**
 * Generate certificate HTML for rendering/PDF conversion
 */
export function generateCertificate(data: CertificateData): string {
  return generateCertificateHTML(data);
}

export type { CertificateData };
