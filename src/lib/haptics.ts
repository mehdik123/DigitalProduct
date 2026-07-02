/** Light haptic feedback — optional on iOS, works on Android Chrome. Never gate meaning on it. */
export const haptic = {
  light: () => navigator.vibrate?.(8),
  medium: () => navigator.vibrate?.(14),
  success: () => navigator.vibrate?.([8, 40, 8]),
  warning: () => navigator.vibrate?.([20, 40, 20]),
};
