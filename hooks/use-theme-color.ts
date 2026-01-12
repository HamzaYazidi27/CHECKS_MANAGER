import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useThemeColor(
  colors: { light?: string; dark?: string },
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = colors[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName) {
    return Colors[theme][colorName];
  }

  return Colors[theme]['background'];
}
