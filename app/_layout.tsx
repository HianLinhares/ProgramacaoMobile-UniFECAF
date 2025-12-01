import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../src/store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> {/* Tela de login */}
        <Stack.Screen name="home" />   {/* Lista de produtos */}
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: 'Detalhes do Produto',
            headerShown: true,
            headerBackTitle: 'Voltar'
          }} 
        />
      </Stack>
    </Provider>
  );
}