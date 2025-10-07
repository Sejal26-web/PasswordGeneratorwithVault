'use client';

import { useState, useEffect } from 'react';
import { VaultItem, VaultItemData } from './vault-item';
import { AddItemDialog } from './add-item-dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { encryptData, decryptData } from '@/lib/encryption';

interface VaultListProps {
  token: string;
  encryptionKey: string;
}

export function VaultList({ token, encryptionKey }: VaultListProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<VaultItemData[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/vault', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const decryptedItems = data.items.map((item: any) => ({
          ...item,
          _id: item._id.toString(),
          password: decryptData(item.password, encryptionKey),
          notes: item.notes ? decryptData(item.notes, encryptionKey) : '',
        }));
        setItems(decryptedItems);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch vault items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  }) => {
    try {
      const encryptedData = {
        ...data,
        password: encryptData(data.password, encryptionKey),
        notes: data.notes ? encryptData(data.notes, encryptionKey) : '',
      };

      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item added to vault',
        });
        fetchItems();
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (
    id: string,
    data: Omit<VaultItemData, '_id'>
  ) => {
    try {
      const encryptedData = {
        ...data,
        password: encryptData(data.password, encryptionKey),
        notes: data.notes ? encryptData(data.notes, encryptionKey) : '',
      };

      const response = await fetch(`/api/vault/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item updated',
        });
        fetchItems();
      } else {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item deleted',
        });
        fetchItems();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${field} copied to clipboard`,
    });

    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 30000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddItemDialog onAdd={handleAdd} />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? 'No items match your search'
              : 'No items in your vault yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <VaultItem
              key={item._id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
