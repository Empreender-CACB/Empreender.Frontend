import { useState, useEffect } from 'react';
import { NavigationTree } from '@/@types/navigation';
import { apiGetNavigationConfig } from '@/services/MenuService';

export const useNavigationConfig = () => {
  const [navigationConfig, setNavigationConfig] = useState<NavigationTree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchConfig = async () => {
          try {
              const response = await apiGetNavigationConfig();
              setNavigationConfig(response.data);
          } catch (error) {
              console.error('Não foi possível carregar a configuração de navegação:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchConfig();
  }, []);

  return { navigationConfig, loading };
};