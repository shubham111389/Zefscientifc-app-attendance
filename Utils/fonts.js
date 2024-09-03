// Utils/fonts.js
import { useFonts } from '@expo-google-fonts/poppins';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export const fonts = {
  Bold: 'Poppins_600SemiBold',
  Light: 'Poppins_400Regular',
  Medium: 'Poppins_500Medium',
  Regular: 'Poppins_400Regular',
  SemiBold: 'Poppins_600SemiBold',
};

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  return fontsLoaded;
};
