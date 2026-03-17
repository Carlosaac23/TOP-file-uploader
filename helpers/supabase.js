import { supabase } from '../lib/supabase.js';

export async function uploadToSupabase(file) {
  const path = `${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage.from('files').upload(path, file.buffer, {
    contentType: file.mimetype,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('files').getPublicUrl(data.path);

  return { url: publicUrl, key: data.path };
}

export async function deleteFromSupabase(key) {
  const { error } = await supabase.storage.from('files').remove([key]);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function downloadFromSupabase(key) {
  const { data, error } = await supabase.storage.from('files').download(key);

  if (error) {
    console.error(error);
    throw error;
  }

  console.log('Data from downloading:', data);
  return data;
}

export async function createSignedURLs(keys) {
  const ONE_DAY = 60 * 60 * 24;
  const { data, error } = await supabase.storage.from('files').createSignedUrls(keys, ONE_DAY);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
