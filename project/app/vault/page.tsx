'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { VaultList } from '@/components/vault-list';
import { Lock, LogOut } from 'lucide-react';

export default function VaultPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedKey = localStorage.getItem('encryptionKey');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedKey) {
      router.push('/login');
      return;
    }

    setToken(storedToken);
    setEncryptionKey(storedKey);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('encryptionKey');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!token || !encryptionKey) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Password Manager</h1>
                {user && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <VaultList token={token} encryptionKey={encryptionKey} />
      </div>
    </div>
  );
}
