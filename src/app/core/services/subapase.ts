
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../services/supabase-config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  /** Subir imagen al bucket */
  async uploadImage(bucket: string, path: string, file: File | Blob) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true 
      });

    if (error) {
      console.error('❌ Error al subir imagen:', error);
      throw error;
    }

    console.log('✅ Imagen subida a:', path);
    return true;
  }

 
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }


  async listFiles(bucket: string, folder: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('❌ Error al listar archivos:', error);
      throw error;
    }

    return data || [];
  }
}
