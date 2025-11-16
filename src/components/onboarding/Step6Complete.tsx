import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OnboardingData } from '@/pages/Onboarding';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

interface Step6Props {
  data: OnboardingData;
  onComplete: () => void;
}

const Step6Complete: React.FC<Step6Props> = ({ data, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your profile...');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initiateDiscovery = async () => {
      if (!user) return;

      const messages = [
        'Analyzing your profile...',
        'Searching scholarship databases...',
        'Running AI matching algorithm...',
        'Prioritizing your opportunities...',
      ];

      let messageIndex = 0;
      const interval = setInterval(() => {
        messageIndex++;
        if (messageIndex < messages.length) {
          setLoadingMessage(messages[messageIndex]);
        }
      }, 1000);

      try {
        // Call backend API to start scholarship discovery
        const profile = {
          name: `${data.firstName} ${data.lastName}`,
          academic_status: data.academicStatus,
          year: data.year,
          school: data.school,
          gpa: data.gpa,
          major: data.major,
          graduation_year: data.graduationYear,
          background: data.background,
          financial_need: data.financialNeed,
          interests: data.interests,
        };

        await apiService.discoverScholarships(user.uid, profile);
        
        clearInterval(interval);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to initiate scholarship discovery:', err);
        // Don't block completion on API failure
        clearInterval(interval);
        setLoading(false);
        setError('Discovery service temporarily unavailable. Your scholarships will be ready shortly.');
      }
    };

    initiateDiscovery();
  }, [user, data]);

  return (
    <div className="space-y-8 animate-scale-in text-center">
      {/* Confetti effect (CSS-based) */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-success/20 animate-ping"></div>
        </div>
        <CheckCircle2 className="h-24 w-24 text-success mx-auto relative z-10" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          You're all set, {data.firstName}! 🎉
        </h1>
        {loading ? (
          <p className="text-lg text-muted-foreground animate-pulse font-medium">
            {loadingMessage}
          </p>
        ) : error ? (
          <p className="text-lg text-warning font-semibold">
            ⚠️ {error}
          </p>
        ) : (
          <p className="text-lg text-success font-semibold">
            ✓ Profile complete! Your scholarships are ready.
          </p>
        )}
      </div>

      {!loading && (
        <Card className="max-w-2xl mx-auto p-6 text-left animate-slide-up border-2 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-foreground">Profile Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b-2 border-border">
              <span className="text-muted-foreground font-semibold">Name:</span>
              <span className="font-bold text-foreground">{data.firstName} {data.lastName}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-border">
              <span className="text-muted-foreground font-semibold">Academic Status:</span>
              <span className="font-bold text-foreground capitalize">
                {data.academicStatus.replace('-', ' ')}
                {data.year && ` (${data.year})`}
              </span>
            </div>
            {data.school && (
              <div className="flex justify-between py-2 border-b-2 border-border">
                <span className="text-muted-foreground font-semibold">School:</span>
                <span className="font-bold text-foreground">{data.school}</span>
              </div>
            )}
            {data.major && (
              <div className="flex justify-between py-2 border-b-2 border-border">
                <span className="text-muted-foreground font-semibold">Major:</span>
                <span className="font-bold text-foreground">{data.major}</span>
              </div>
            )}
            {data.gpa && (
              <div className="flex justify-between py-2 border-b-2 border-border">
                <span className="text-muted-foreground font-semibold">GPA:</span>
                <span className="font-bold text-foreground">{data.gpa.toFixed(1)}</span>
              </div>
            )}
            {data.interests.length > 0 && (
              <div className="flex justify-between py-2 border-b-2 border-border">
                <span className="text-muted-foreground font-semibold">Interests:</span>
                <span className="font-bold text-foreground">{data.interests.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {!loading && (
        <Card className="max-w-2xl mx-auto p-6 bg-primary/5 border-2 border-primary/20 animate-slide-up">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-3 text-foreground">What Happens Next?</h3>
          <ul className="space-y-2 text-sm text-left">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-foreground">We've matched you with personalized scholarships</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-foreground">Your dashboard is ready with deadlines and priorities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-foreground">AI assistant is standing by to help with applications</span>
            </li>
          </ul>
        </Card>
      )}

      <Button
        size="lg"
        className="animate-pulse-glow"
        onClick={onComplete}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'See My Opportunities'}
      </Button>
    </div>
  );
};

export default Step6Complete;