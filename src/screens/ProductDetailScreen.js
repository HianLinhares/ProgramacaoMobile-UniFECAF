import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { productApi } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Ops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = product.discountPercentage
    ? Math.round(product.discountPercentage)
    : 0;

  // Calcula o preço original (antes do desconto) em USD
  const originalPrice = discount > 0 
    ? product.price / (1 - discount/100)
    : product.price;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backHeaderButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backHeaderText}>Voltar</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: product.thumbnail }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
          
          <View style={styles.priceContainer}>
            <View style={styles.currentPriceContainer}>
              {/* VOLTOU PARA DÓLAR */}
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              )}
            </View>
            
            {discount > 0 && (
              <View style={styles.originalPriceContainer}>
                <Text style={styles.originalPriceLabel}>De:</Text>
                {/* VOLTOU PARA DÓLAR */}
                <Text style={styles.originalPrice}>
                  ${originalPrice.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FF9500" />
              <Text style={styles.rating}>{product.rating}</Text>
            </View>
            
            <View style={[
              styles.stockContainer,
              { backgroundColor: product.stock > 0 ? '#E7F7E9' : '#FFE5E5' }
            ]}>
              <Ionicons 
                name={product.stock > 0 ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={product.stock > 0 ? '#34C759' : '#FF3B30'} 
              />
              <Text style={[
                styles.stock,
                { color: product.stock > 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{product.category}</Text>
            </View>
          </View>
          
          {product.images && product.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mais Imagens</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScroll}
              >
                {product.images.slice(0, 5).map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.extraImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="cube-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>SKU:</Text>
              <Text style={styles.infoValue}>{product.id}</Text>
            </View>
            
            {product.weight && (
              <View style={styles.infoRow}>
                <Ionicons name="scale-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Peso:</Text>
                <Text style={styles.infoValue}>{product.weight}g</Text>
              </View>
            )}
            
            {product.dimensions && (
              <View style={styles.infoRow}>
                <Ionicons name="resize-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Dimensões:</Text>
                <Text style={styles.infoValue}>
                  {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backHeaderText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  productImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 34,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  priceContainer: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPriceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  rating: {
    fontSize: 18,
    color: '#FF9500',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  stock: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    fontWeight: '500',
  },
  imagesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  extraImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  additionalInfo: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    marginRight: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;