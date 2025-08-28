import { Response } from 'express';
import { User } from '../models/User.js';
import { QuizAttempt } from '../models/Progress.js';
import { AuthRequest } from '../middleware/auth.js';
import { CertificateGenerator } from '../utils/certificateGenerator.js';

const certificateGenerator = new CertificateGenerator();

export const generateWebDevCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user has already earned this certificate
    const existingCertIndex = user.certificates?.findIndex(cert => cert.type === 'webdev') ?? -1;
    if (existingCertIndex >= 0 && user.certificates) {
      const existingCert = user.certificates[existingCertIndex];
      res.json({
        message: 'Certificate already exists',
        certificate: existingCert
      });
      return;
    }

    // Check if user has completed web development
    const isCompleted = await certificateGenerator.checkWebDevCompletion(user.progress);
    if (!isCompleted) {
      res.status(400).json({ 
        error: 'Web Development course not completed yet',
        message: 'Please complete all 6 modules (HTML, CSS, JavaScript, React, Node.js, MongoDB) to earn your certificate'
      });
      return;
    }

    // Generate certificate
    const certificateId = certificateGenerator.generateCertificateId();
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const certificateData = {
      userName: user.displayName,
      courseTitle: 'Web Development Mastery Program',
      completionDate,
      certificateId
    };

    const downloadUrl = await certificateGenerator.generateWebDevCertificate(certificateData);

    // Save certificate to user record
    if (!user.certificates) {
      user.certificates = [];
    }
    
    user.certificates.push({
      type: 'webdev',
      issuedDate: new Date(),
      certificateId,
      downloadUrl
    });

    // Add certificate badge
    if (!user.badges.includes('webdev-certificate')) {
      user.badges.push('webdev-certificate');
    }

    await user.save();

    res.json({
      message: 'Certificate generated successfully',
      certificate: {
        type: 'webdev',
        issuedDate: new Date(),
        certificateId,
        downloadUrl
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
};

export const getUserCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('certificates displayName');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      certificates: user.certificates || [],
      userName: user.displayName
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

export const verifyCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { certificateId } = req.params;

    const user = await User.findOne({
      'certificates.certificateId': certificateId
    }).select('displayName certificates');

    if (!user) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    const certificate = user.certificates?.find(cert => cert.certificateId === certificateId);
    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    res.json({
      valid: true,
      certificate: {
        ...certificate,
        userName: user.displayName
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

// Returns a local static PDF URL for the user's webdev certificate (or 404)
export const getSignedCertificateUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const user = await User.findById(req.user._id).select('certificates displayName');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const cert = user.certificates?.find(c => c.type === 'webdev');
    if (!cert) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }
    const id = cert.certificateId;
    // Ensure local file exists; if not, regenerate with same certificateId
    const filename = `${user.displayName}-WebDev.pdf`;
    const localUrl = certificateGenerator.generateSignedDownloadUrl(id, filename);
    const fs = await import('fs');
    const path = await import('path');
    const localPath = path.resolve(process.cwd(), 'temp', 'certificates', `${id}.pdf`);
    if (!fs.existsSync(localPath)) {
      const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const certData = {
        userName: user.displayName,
        courseTitle: 'Web Development Mastery Program',
        completionDate,
        certificateId: id,
      };
      const newUrl = await certificateGenerator.generateWebDevCertificate(certData);
      cert.downloadUrl = newUrl;
      await user.save();
    }

    res.json({ url: localUrl });
  } catch (error) {
    console.error('Get signed certificate URL error:', error);
    res.status(500).json({ error: 'Failed to get certificate URL' });
  }
};

// Direct PDF download endpoint for production
export const downloadWebDevCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('certificates displayName');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const cert = user.certificates?.find(c => c.type === 'webdev');
    if (!cert) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    // Generate PDF bytes
    const certificateData = {
      userName: user.displayName,
      courseTitle: 'Web Development Mastery Program',
      completionDate: cert.issuedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      certificateId: cert.certificateId
    };

    const pdfBytes = await certificateGenerator.generateWebDevCertificatePDF(certificateData);
    const filename = `${user.displayName.replace(/[^a-zA-Z0-9]/g, '-')}-WebDev-Certificate.pdf`;

    // Send PDF directly as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBytes.length.toString());
    
    console.log(`📄 Sending certificate download for ${user.displayName}, size: ${pdfBytes.length} bytes`);
    res.send(Buffer.from(pdfBytes));
    
  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({ error: 'Failed to download certificate' });
  }
};

export const checkWebDevEligibility = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get passed quizzes by subject for multi-quiz subjects
    const allWebdevPassed = await QuizAttempt.find({ 
      userId: req.user._id, 
      subject: { $in: ['html','css','javascript','react','nodejs','mongodb'] } 
    }).select('subject topic score totalQuestions');

    const passedQuizzesBySubject: Record<string, string[]> = {};
    for (const attempt of allWebdevPassed) {
      const subj = (attempt as any).subject as string;
      const totalQ = (attempt as any).totalQuestions || 0;
      const score = (attempt as any).score || 0;
      const passed = totalQ > 0 && (score / totalQ) >= 0.7;
      const topic = (attempt as any).topic || 'default';
      if (passed) {
        if (!passedQuizzesBySubject[subj]) passedQuizzesBySubject[subj] = [];
        if (!passedQuizzesBySubject[subj].includes(topic)) {
          passedQuizzesBySubject[subj].push(topic);
        }
      }
    }

    // Enhanced completion check for WebDev
    const webdevSubjects = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
    let isCompleted = true;

    for (const subject of webdevSubjects) {
      const subjectProgress = (user.progress.webdev as any)[subject];
      if (!subjectProgress || subjectProgress.videosWatched < 11) {
        isCompleted = false;
        break;
      }

      // For multi-quiz subjects, check if at least some quizzes passed
      if (['javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
        const passedQuizzes = passedQuizzesBySubject[subject] || [];
        if (passedQuizzes.length === 0) {
          isCompleted = false;
          break;
        }
      } else {
        // For single-quiz subjects, check if quiz passed
        if (!subjectProgress.quizPassed) {
          isCompleted = false;
          break;
        }
      }
    }

    const hasExistingCert = user.certificates?.some(cert => cert.type === 'webdev');

    res.json({
      eligible: isCompleted && !hasExistingCert,
      completed: isCompleted,
      hasExistingCertificate: hasExistingCert
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
};
