import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function Redirect() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marca el componente como montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Redirige según la plataforma
      if (Platform.OS === 'web') {
        router.replace('/web');
      } else {
        router.replace('/movil');
      }
    }
  }, [isMounted]);

  return null;
}