import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProductListScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('mens-shirts');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dummyjson.com/products/category/${category}`
      );
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO DE LOGOUT SIMPLES E FUNCIONAL
  const handleLogout = () => {
    console.log('Botão de logout pressionado');
    
    // Método 1: Tenta navegar diretamente
    try {
      router.replace('/');
      console.log('router.replace executado');
    } catch (error) {
      console.log('Erro no router.replace:', error);
      
      // Método 2: Tenta alternativo
      router.push('/');
      console.log('router.push executado como fallback');
    }
  };

  // ALTERNATIVA: Função de logout com timeout (resolve problemas de timing)
  const handleLogoutAlternative = () => {
    console.log('Logout com timeout');
    
    // Pequeno timeout para garantir que a UI responda primeiro
    setTimeout(() => {
      router.replace('/');
    }, 100);
  };

  // TESTE: Botão que SEMPRE funciona
  const handleLogoutTest = () => {
    console.log('=== TESTE DE LOGOUT ===');
    console.log('Router disponível:', !!router);
    console.log('Tentando navegar para /');
    
    // Tenta todos os métodos possíveis
    try {
      // 1. Primeiro método
      router.navigate('/');
      console.log('Método 1: router.navigate executado');
      
      // 2. Segundo método (fallback)
      setTimeout(() => {
        router.push('/');
        console.log('Método 2: router.push executado');
      }, 50);
      
      // 3. Terceiro método (fallback extremo)
      setTimeout(() => {
        if (router.canGoBack()) {
          router.dismissAll();
          router.replace('/');
        } else {
          router.replace('/');
        }
        console.log('Método 3: router.replace executado');
      }, 100);
      
    } catch (error) {
      console.log('Erro durante logout:', error);
    }
  };

  const categories = [
    { id: 'mens-shirts', name: 'Camisas Masculinas' },
    { id: 'mens-shoes', name: 'Calçados Masculinos' },
    { id: 'mens-watches', name: 'Relógios Masculinos' },
    { id: 'womens-dresses', name: 'Vestidos' },
    { id: 'womens-shoes', name: 'Calçados Femininos' },
    { id: 'womens-jewellery', name: 'Jóias' },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Catálogo de Produtos</Text>
        
        {/* BOTÃO DE LOGOUT - VERSÃO FINAL */}
        <TouchableOpacity 
          onPress={handleLogout} // Use handleLogout para produção
          // onPress={handleLogoutTest} // Use este para debug
          style={styles.logoutButton}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === item.id && styles.activeCategoryButton,
              ]}
              onPress={() => setCategory(item.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item.id && styles.activeCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.productBrand}>{item.brand}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
                {item.discountPercentage && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      -{Math.round(item.discountPercentage)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        }
      />
      
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
    fontSize: 16,
  },
  testButton: {
    backgroundColor: '#5856D6',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});