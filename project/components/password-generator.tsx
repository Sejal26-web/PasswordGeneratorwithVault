'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePassword, calculatePasswordStrength } from '@/lib/password-generator';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordGeneratorProps {
  onUsePassword?: (password: string) => void;
}

export function PasswordGenerator({ onUsePassword }: PasswordGeneratorProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);

  const strength = password ? calculatePasswordStrength(password) : null;

  const handleGenerate = () => {
    const newPassword = generatePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
    });
    setPassword(newPassword);
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      toast({
        title: 'Copied!',
        description: 'Password copied to clipboard',
      });
    }
  };

  const handleUse = () => {
    if (password && onUsePassword) {
      onUsePassword(password);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={password}
              readOnly
              placeholder="Generated password will appear here"
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!password}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          {strength && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Strength:</span>
              <span className={`text-sm font-medium ${strength.color}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Length: {length}</Label>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={64}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Numbers (0-9)</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Symbols (!@#$%)</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="similar">Exclude Similar (i, l, 1, O, 0)</Label>
              <Switch
                id="similar"
                checked={excludeSimilar}
                onCheckedChange={setExcludeSimilar}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="flex-1">
            Generate Password
          </Button>
          {onUsePassword && (
            <Button
              onClick={handleUse}
              variant="secondary"
              disabled={!password}
              className="flex-1"
            >
              Use This Password
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
