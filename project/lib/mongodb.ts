import fs from 'fs';
import path from 'path';

interface Document {
  _id?: string;
  [key: string]: any;
}

class MockCollection {
  private data: Document[] = [];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.data = [];
        this.saveData();
      }
    } catch (error) {
      this.data = [];
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async find(query: any = {}): Promise<Document[]> {
    let results = this.data;
    for (const key in query) {
      results = results.filter(item => item[key] === query[key]);
    }
    return results;
  }

  async findOne(query: any): Promise<Document | null> {
    const results = await this.find(query);
    return results[0] || null;
  }

  async insertOne(doc: Document): Promise<{ insertedId: string }> {
    const id = this.generateId();
    doc._id = id;
    this.data.push(doc);
    this.saveData();
    return { insertedId: id };
  }

  async updateOne(query: any, update: any): Promise<{ modifiedCount: number }> {
    const index = this.data.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      Object.assign(this.data[index], update.$set || update);
      this.saveData();
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query: any): Promise<{ deletedCount: number }> {
    const index = this.data.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.data.splice(index, 1);
      this.saveData();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

class MockDb {
  private collections: { [key: string]: MockCollection } = {};

  collection(name: string): MockCollection {
    if (!this.collections[name]) {
      const filePath = path.join(process.cwd(), `${name}.json`);
      this.collections[name] = new MockCollection(filePath);
    }
    return this.collections[name];
  }
}

export async function getDatabase(): Promise<MockDb> {
  return new MockDb();
}
