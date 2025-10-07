'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Key, Eye } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/vault');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-slate-900 rounded-2xl">
              <Lock className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Secure Password Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Generate, store, and manage your passwords with end-to-end encryption.
            Your data is encrypted on your device before it reaches our servers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="p-3 bg-slate-100 rounded-lg w-fit mb-2">
                <Key className="h-6 w-6 text-slate-900" />
              </div>
              <CardTitle>Password Generator</CardTitle>
              <CardDescription>
                Generate strong, unique passwords with customizable options including
                length, character types, and exclusion of similar characters.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-3 bg-slate-100 rounded-lg w-fit mb-2">
                <Shield className="h-6 w-6 text-slate-900" />
              </div>
              <CardTitle>Client-Side Encryption</CardTitle>
              <CardDescription>
                Your passwords are encrypted on your device using AES encryption
                before being stored. We never see your plaintext passwords.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-3 bg-slate-100 rounded-lg w-fit mb-2">
                <Eye className="h-6 w-6 text-slate-900" />
              </div>
              <CardTitle>Secure Vault</CardTitle>
              <CardDescription>
                Store passwords with usernames, URLs, and notes. Search and filter
                your vault, copy passwords with auto-clear after 30 seconds.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
