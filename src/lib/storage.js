import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadAvatar = async (userId, file) => {
  if (!userId || !file) throw new Error('Missing user ID or file');
  
  // Create a reference to 'avatars/userId/filename'
  // Using a timestamp in the filename helps avoid caching issues when the user changes their avatar
  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `avatar-${Date.now()}.${extension}`;
  const avatarRef = ref(storage, `avatars/${userId}/${fileName}`);
  
  // Upload the file
  await uploadBytes(avatarRef, file);
  
  // Get the public download URL
  const downloadURL = await getDownloadURL(avatarRef);
  return downloadURL;
};
