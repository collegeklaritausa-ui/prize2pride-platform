import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Award, 
  Download, 
  Share2, 
  Calendar,
  Trophy,
  Star,
  Sparkles,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

interface Certificate {
  id: string;
  lessonTitle: string;
  level: string;
  score: number;
  xpEarned: number;
  completedAt: string;
}

export default function Certificates() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: progress, isLoading } = trpc.progress.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  });

  // Filter completed lessons as certificates
  const certificates: Certificate[] = (progress || [])
    .filter((p: any) => p.status === 'completed' && p.score && p.score >= 70)
    .map((p: any) => ({
      id: `cert-${p.lessonId}-${p.completedAt}`,
      lessonTitle: `Lesson ${p.lessonId}`, // Would be populated from lesson data
      level: 'A1', // Would be populated from lesson data
      score: p.score || 0,
      xpEarned: p.xpEarned || 0,
      completedAt: p.completedAt || new Date().toISOString()
    }));

  const handleDownload = async (cert: Certificate) => {
    // Generate certificate HTML and trigger download
    const certificateHTML = generateCertificateHTML(cert, user?.name || 'Learner');
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prize2Pride-Certificate-${cert.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (cert: Certificate) => {
    const shareText = `🎓 I earned a certificate in "${cert.lessonTitle}" with a score of ${cert.score}% on Prize2Pride! #LearnEnglish #Prize2Pride`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Prize2Pride Certificate',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  if (authLoading || isLoading) {
    return <CertificatesSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Prize2Pride
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Certificate Gallery
              </h1>
              <p className="text-muted-foreground">
                Your achievements and completed courses
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">Total Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {certificates.length > 0 
                      ? Math.round(certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {certificates.reduce((sum, c) => sum + c.xpEarned, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total XP Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Certificates Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete lessons with a score of 70% or higher to earn certificates and showcase your achievements.
            </p>
            <Link href="/lessons">
              <Button className="gradient-navy text-white">
                Start Learning
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="h-2 gradient-gold" />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge className={`badge-${cert.level.toLowerCase()}`}>
                        Level {cert.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(cert.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{cert.lessonTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{cert.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-secondary">{cert.xpEarned}</p>
                        <p className="text-xs text-muted-foreground">XP Earned</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(cert)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleShare(cert)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CertificatesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center h-16">
          <Skeleton className="w-32 h-8" />
        </div>
      </nav>
      <main className="container py-8">
        <Skeleton className="w-64 h-10 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </main>
    </div>
  );
}

function generateCertificateHTML(cert: Certificate, userName: string): string {
  const formattedDate = new Date(cert.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Prize2Pride Certificate - ${cert.lessonTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      top: 15px; left: 15px; right: 15px; bottom: 15px;
      border: 3px solid #c9a227;
      border-radius: 15px;
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, #c9a227 0%, #f4d03f 100%);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 36px;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 42px; font-weight: 700; color: #1a1a2e;
    }
    .subtitle {
      font-size: 16px; color: #666;
      text-transform: uppercase; letter-spacing: 4px;
    }
    .content { text-align: center; margin: 40px 0; }
    .name {
      font-family: 'Playfair Display', serif;
      font-size: 48px; font-weight: 600; color: #c9a227;
      text-decoration: underline; text-underline-offset: 10px;
    }
    .achievement { font-size: 18px; color: #333; line-height: 1.8; }
    .stats { display: flex; justify-content: center; gap: 60px; margin: 40px 0; }
    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 36px; font-weight: 700; color: #c9a227;
    }
    .stat-label { font-size: 12px; color: #888; text-transform: uppercase; }
    .footer {
      display: flex; justify-content: space-between;
      margin-top: 50px; padding-top: 30px; border-top: 2px solid #eee;
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
      <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">
        This certificate is proudly presented to
      </p>
      <h2 class="name">${userName}</h2>
      <p class="achievement" style="margin-top: 30px;">
        For successfully completing<br>
        <strong>"${cert.lessonTitle}"</strong>
      </p>
      <div style="display: inline-block; padding: 8px 20px; background: #1a1a2e; color: #fff; border-radius: 30px; margin-top: 20px;">
        Level ${cert.level}
      </div>
    </div>
    <div class="stats">
      <div style="text-align: center;">
        <div class="stat-value">${cert.score}%</div>
        <div class="stat-label">Final Score</div>
      </div>
      <div style="text-align: center;">
        <div class="stat-value">${cert.xpEarned}</div>
        <div class="stat-label">XP Earned</div>
      </div>
    </div>
    <div class="footer">
      <div style="color: #666;">Issued on ${formattedDate}</div>
      <div style="text-align: center;">
        <div style="width: 200px; border-bottom: 2px solid #333; margin-bottom: 10px;"></div>
        <p style="font-family: 'Playfair Display', serif; font-style: italic;">Manus AI</p>
        <p style="font-size: 12px; color: #888;">Platform Director</p>
      </div>
      <div style="color: #aaa; font-size: 10px;">ID: ${cert.id}</div>
    </div>
  </div>
</body>
</html>`;
}
